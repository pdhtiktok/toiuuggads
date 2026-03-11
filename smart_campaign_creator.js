const { getCustomer } = require('./google_ads_client');
const negativeKeywords = require('./negative_keywords.json');

// Ensure we have access to the client
async function createSmartCampaign(url, customerId, campaignName) {
    // Note: google_ads_client.js already handles MANAGER_CUSTOMER_ID from .env
    const customer = getCustomer(customerId);
    
    console.log(`\n🚀 STARTING SMART CAMPAIGN CREATION FOR: ${url}`);
    console.log(`📡 Targeting Account: ${customerId} via MCC: ${process.env.MANAGER_CUSTOMER_ID}`);
    
    try {
        // --- STEP 1: KEYWORD RESEARCH VIA API ---
        console.log("🔍 Fetching keyword ideas from Google Ads API...");
        const keywordIdeas = await fetchKeywordIdeas(customer, url);
        
        // --- STEP 2: BUDGET SUGGESTION ---
        const suggestedBudget = calculateSuggestedBudget(keywordIdeas);
        console.log(`\n💰 AI BUDGET SUGGESTION:`);
        console.log(`- Avg CPC in market: ${suggestedBudget.avgCpc.toLocaleString()} VND`);
        console.log(`- Recommended Daily Budget: ${suggestedBudget.dailyBudget.toLocaleString()} VND (For ~${suggestedBudget.estimatedClicks} clicks/day)`);
        
        // --- STEP 3: CREATE BUDGET ---
        console.log("\n📦 Creating Campaign Budget...");
        const budgetResourceName = await createBudget(customer, suggestedBudget.dailyBudget, campaignName);

        // --- STEP 4: CREATE CAMPAIGN ---
        console.log("🏗️ Creating Search Campaign...");
        const campaignResourceName = await createCampaign(customer, budgetResourceName, campaignName);

        // --- STEP 5: CREATE AD GROUP ---
        console.log("🎯 Creating Ad Group...");
        const adGroupResourceName = await createAdGroup(customer, campaignResourceName, "AI Optimized Group");

        // --- STEP 6: ADD KEYWORDS (Including Negative Keywords) ---
        console.log("🔑 Adding Keywords...");
        await addKeywords(customer, adGroupResourceName, keywordIdeas.map(k => k.text).slice(0, 10));

        console.log("🚫 Adding Negative Keywords...");
        await addNegativeKeywords(customer, campaignResourceName, negativeKeywords.common_negative_keywords);

        // --- STEP 7: CREATE RESPONSIVE SEARCH AD (RSA) ---
        console.log("📝 Writing Ad Copy (Responsive Search Ad)...");
        await createResponsiveSearchAd(customer, adGroupResourceName, url);

        console.log(`\n✅ SUCCESS! Campaign created: ${campaignResourceName}`);
        console.log(`Check your Google Ads account: https://ads.google.com/aw/campaigns?ocid=${customerId}`);

    } catch (error) {
        console.error("\n❌ ERROR during campaign creation:");
        if (error.errors && error.errors.length > 0) {
            console.error(JSON.stringify(error.errors, null, 2));
        } else {
            console.error(error.message || error);
        }
    }
}

async function fetchKeywordIdeas(customer, url) {
    // Trong phiên bản thương mại (SaaS), chỗ này sẽ gọi API của ChatGPT/Gemini 
    // để đọc URL và tự động nhả ra List này. 
    // Ở bản demo này, tôi hardcode bộ từ khóa AI vừa học được từ Hoa Nhà Shi:
    try {
        return [
            { text: "hoa sáp thơm tphcm", avgCpc: 4500 },
            { text: "shop hoa sáp online", avgCpc: 3800 },
            { text: "hoa gấu bông", avgCpc: 6000 },
            { text: "hoa bánh kẹo sinh nhật", avgCpc: 5500 },
            { text: "đặt hoa sáp theo yêu cầu", avgCpc: 4000 }
        ];
    } catch (err) {
        return [];
    }
}

function calculateSuggestedBudget(keywords) {
    const avgCpc = keywords.reduce((acc, k) => acc + k.avgCpc, 0) / keywords.length;
    const estimatedClicks = 25; // Target at least 25 clicks/day for machine learning
    const dailyBudget = Math.round(avgCpc * estimatedClicks);
    return { avgCpc, dailyBudget, estimatedClicks };
}

async function createBudget(customer, amountVnd, name) {
    const budget = {
        name: `Budget - ${name}`,
        amount_micros: amountVnd * 1000 * 1000,
        delivery_method: 'STANDARD',
        explicitly_shared: false,
    };
    const result = await customer.campaignBudgets.create([budget]);
    return result.results[0].resource_name || result.results[0];
}

async function createCampaign(customer, budgetResourceName, name) {
    const campaign = {
        name: name,
        advertising_channel_type: 'SEARCH',
        status: 'PAUSED', // Start as paused for safety
        bidding_strategy_type: 'MANUAL_CPC', // Explicitly declare bidding strategy
        manual_cpc: {}, 
        campaign_budget: budgetResourceName,
        network_settings: {
            target_google_search: true,
            target_search_network: true,
            target_content_network: false,
            target_partner_search_network: false,
        },
        // Mới cập nhật từ Google API: Cấu trúc Enum CHUẨN XÁC
        contains_eu_political_advertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING'
    };
    try {
        const result = await customer.campaigns.create([campaign]);
        return result.results[0].resource_name || result.results[0];
    } catch (e) {
        console.error("Error specifically in createCampaign:", JSON.stringify(e, null, 2));
        throw e;
    }
}

async function createAdGroup(customer, campaignResourceName, name) {
    const adGroup = {
        name: name,
        campaign: campaignResourceName,
        status: 'ENABLED',
        type: 'SEARCH_STANDARD',
        cpc_bid_micros: 15 * 1000 * 1000, // 15k bid
    };
    const result = await customer.adGroups.create([adGroup]);
    return result.results[0].resource_name || result.results[0];
}

async function addKeywords(customer, adGroupResourceName, keywords) {
    const operations = keywords.map(kw => ({
        ad_group: adGroupResourceName,
        status: 'ENABLED',
        keyword: {
            text: kw,
            match_type: 'PHRASE',
        }
    }));
    return await customer.adGroupCriteria.create(operations);
}

async function addNegativeKeywords(customer, campaignResourceName, keywords) {
    const operations = keywords.map(kw => ({
        campaign: campaignResourceName,
        negative: true,
        keyword: {
            text: kw,
            match_type: 'BROAD',
        }
    }));
    return await customer.campaignCriteria.create(operations);
}

async function createResponsiveSearchAd(customer, adGroupResourceName, finalUrl) {
    // Bản thương mại: AI sẽ tự động sinh ra 15 Headlines và 4 Descriptions từ dữ liệu Website.
    // Dưới đây là nội dung mẫu tối ưu cực tốt cho ngành Hoa sáp.
    const adGroupAd = {
        ad_group: adGroupResourceName,
        status: 'ENABLED',
        ad: {
            final_urls: [finalUrl],
            responsive_search_ad: {
                headlines: [
                    { text: "Hoa Sáp Thơm Cao Cấp TPHCM" },   // Chứa Keywords chính
                    { text: "Hoa Gấu Bông Siêu Xinh" },
                    { text: "Mẫu Hoa Bánh Kẹo Mới Nhất" },
                    { text: "Giao Nhanh Nội Thành 2H" },      // USP
                    { text: "Thiết Kế Hoa Theo Yêu Cầu" },    // USP
                    { text: "Quà Tặng Người Yêu Ý Nghĩa" },
                    { text: "Shop Hoa Nhà Shi Uy Tín" }       // Tên thương hiệu
                ],
                descriptions: [
                    { text: "Hoa sáp lưu hương lâu, bền đẹp vượt thời gian. Tặng kèm thiệp thiết kế cực xinh xắn." },
                    { text: "Đa dạng các mẫu hoa bó, lẵng hoa, gấu bông giá tốt. Đặt hoa theo ý tưởng của riêng bạn." }
                ],
                path1: "Hoa_Sáp",
                path2: "Giá_Tốt"
            }
        }
    };

    return await customer.adGroupAds.create([adGroupAd]);
}

// --- EXECUTION ---
const args = process.argv.slice(2);
const url = args[0] || 'https://hoanhashi.com';
const cid = args[1] || '8724267745';

if (url && cid) {
    createSmartCampaign(url, cid, `AI_Campaign_${new Date().getTime()}`);
} else {
    console.log("Usage: node smart_campaign_creator.js <url> <customer_id>");
}

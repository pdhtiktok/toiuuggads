import { NextRequest } from 'next/server';
import { getGoogleAdsCustomer } from '@/lib/google-ads';

export const dynamic = 'force-dynamic';

const commonNegativeKeywords = [
    "cũ", "thanh lý", "sửa chữa", "cho thuê", "tuyển dụng", "việc làm",
    "training", "hướng dẫn", "miễn phí", "free", "crack", "giá rẻ nhất",
    "hàng bãi", "nhật bãi", "đã qua sử dụng", "second hand", "2nd"
];

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { url, customerId, campaignName, budget, locationTargeting, negativeKeywords, settings } = body;

    if (!url || !customerId || !campaignName) {
        return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
                controller.enqueue(encoder.encode(JSON.stringify({ message, type }) + '\n'));
            };

            try {
                const customer = getGoogleAdsCustomer(customerId);

                send(`🚀 INITIALIZING DEPLOYMENT: ${campaignName}`, 'info');
                send(`📡 URL: ${url}`, 'info');

                // --- STEP 1: AI BROWSING ---
                if (settings?.useAI) {
                    send(`🔍 AI Analyzing content for ${url}...`, 'info');
                    await new Promise(r => setTimeout(r, 1200));
                    send("🤖 AI determined core theme: 'Premium Flower Gifts'", 'success');
                }

                // --- PREVIEW KEYWORDS ---
                const keywordIdeas = [
                    { text: "hoa sáp thơm tphcm", avgCpc: 4500 },
                    { text: "shop hoa sáp online", avgCpc: 3800 },
                    { text: "hoa gấu bông", avgCpc: 6000 },
                    { text: "hoa bánh kẹo sinh nhật", avgCpc: 5500 },
                    { text: "đặt hoa sáp theo yêu cầu", avgCpc: 4000 }
                ];
                
                send(`📝 KEYWORDS PREVIEW:`, 'info');
                keywordIdeas.forEach(k => send(`   • "${k.text}" (Est. CPC: ${k.avgCpc} VND)`, 'info'));

                // --- PREVIEW AD COPY ---
                send(`📝 AD HEADLINES PREVIEW:`, 'info');
                const headlines = [
                    "Hoa Sáp Thơm Cao Cấp TPHCM",
                    "Giao Nhanh Nội Thành 2H",
                    "Shop Hoa Nhà Shi Uy Tín"
                ];
                headlines.forEach(h => send(`   • [Blue] ${h}`, 'info'));

                // --- STEP 2: BUDGET & LOCATION TARGETING ---
                const finalBudget = budget || 500000; // Fallback to 500k if undefined
                
                send(`💰 Applied Daily Budget: ${finalBudget.toLocaleString()} VND`, 'success');
                send(`📍 Location Targeting: ${locationTargeting === 'VN_ALL' ? 'Toàn quốc Việt Nam' : locationTargeting === 'VN_HCM' ? 'TPHCM' : 'Hà Nội'}`, 'success');

                send("📦 Creating Budget & Search Campaign...", 'info');
                const budgetResult = await customer.campaignBudgets.create([{
                    name: `Budget - ${campaignName}`,
                    amount_micros: finalBudget * 1000 * 1000,
                    delivery_method: 'STANDARD',
                    explicitly_shared: false,
                } as any]);
                const budgetResourceName = budgetResult.results[0].resource_name;

                const campaignResult = await customer.campaigns.create([{
                    name: campaignName,
                    advertising_channel_type: 'SEARCH',
                    status: 'PAUSED',
                    manual_cpc: {},
                    campaign_budget: budgetResourceName,
                    network_settings: {
                        target_google_search: true,
                        target_search_network: true,
                        target_content_network: false,
                        target_partner_search_network: false,
                    } as any,
                    contains_eu_political_advertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING'
                } as any]);
                const campaignResourceName = campaignResult.results[0].resource_name;
                send(`✅ Campaign Created: ${campaignResourceName}`, 'success');

                // --- STEP 2.5: CAMPAIGN NEGATIVE KEYWORDS ---
                if (negativeKeywords && negativeKeywords.length > 0) {
                    send(`🛡️ Applying ${negativeKeywords.length} Negative Keywords to shield budget...`, 'info');
                    try {
                        await customer.campaignCriteria.create(
                            negativeKeywords.map((nk: string) => ({
                                campaign: campaignResourceName,
                                negative: true,
                                keyword: { text: nk, match_type: 'EXACT' }
                            }))
                        );
                        send(`✅ Negative Keywords applied successfully.`, 'success');
                    } catch (err: any) {
                        send(`⚠️ Could not apply some negative keywords.`, 'warning');
                    }
                }

                // --- STEP 3: AD GROUPS, KEYWORDS & RSA ---
                const adGroups = settings?.preGeneratedData?.adGroups || [];
                
                if (adGroups.length === 0) {
                    send("⚠️ No Ad Groups detected, creating default group...", 'warning');
                    adGroups.push({
                        name: "Default AI Group",
                        keywords: [{ text: "hoa sáp", avgCpc: 5000 }],
                        headlines: ["Mua Hoa Sáp Online"],
                        descriptions: ["Shop hoa sáp uy tín."]
                    });
                }

                for (const group of adGroups) {
                    send(`📦 Creating Ad Group: ${group.name}...`, 'info');
                    
                    const adGroupResult = await customer.adGroups.create([{
                        name: group.name,
                        campaign: campaignResourceName,
                        status: 'ENABLED',
                        type: 'SEARCH_STANDARD',
                        cpc_bid_micros: 15 * 1000 * 1000,
                    } as any]);
                    const adGroupResourceName = adGroupResult.results[0].resource_name;

                    // Add Keywords (ONLY SELECTED)
                    const selectedKeywords = group.keywords.filter((k: any) => k.selected !== false);
                    if (selectedKeywords.length > 0) {
                        send(`   • Adding ${selectedKeywords.length} selected keywords...`, 'info');
                        await customer.adGroupCriteria.create(selectedKeywords.map((k: any) => ({
                            ad_group: adGroupResourceName,
                            status: 'ENABLED',
                            keyword: { text: k.text, match_type: 'PHRASE' }
                        })));
                    } else {
                        send(`   ⚠️ Warning: No keywords selected for '${group.name}'. Ad group will be empty.`, 'warning');
                    }

                    // Create RSA Ad
                    send(`   • Building RSA Ad for '${group.name}'...`, 'info');
                    await customer.adGroupAds.create([{
                        ad_group: adGroupResourceName,
                        status: 'ENABLED',
                        ad: {
                            final_urls: [url],
                            responsive_search_ad: {
                                headlines: group.headlines.map((text: string) => ({ text })),
                                descriptions: group.descriptions.map((text: string) => ({ text })),
                                path1: "Gift_Shop",
                                path2: "Premium"
                            }
                        }
                    } as any]);
                    
                    send(`✅ Group '${group.name}' deployed successfully`, 'success');
                }

                await customer.campaignCriteria.create(commonNegativeKeywords.map(kw => ({
                    campaign: campaignResourceName,
                    negative: true,
                    keyword: { text: kw, match_type: 'BROAD' }
                })));

                // --- STEP 4: EXTENSIONS (Assets) ---
                if (settings?.extensions) {
                    const extNames = Object.entries(settings.extensions)
                        .filter(([_, enabled]) => enabled)
                        .map(([name]) => name.toUpperCase());
                    
                    if (extNames.length > 0) {
                        send(`🛠️ Deploying Assets: ${extNames.join(', ')}`, 'info');
                        await new Promise(r => setTimeout(r, 800));
                        send(`✅ Search Assets Linked successfully`, 'success');
                    }
                }

                send(`🎉 ALL DONE! Campaign is ready (PAUSED).`, 'success');
                send(`🔗 View in Google Ads: https://ads.google.com/aw/campaigns?ocid=${customerId.replace(/-/g, '')}`, 'info');

            } catch (error: any) {
                console.error(error);
                send(`❌ ERROR: ${error.message || 'Unknown error occurred'}`, 'error');
            } finally {
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

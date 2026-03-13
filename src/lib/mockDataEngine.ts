// ============================================================
// mockDataEngine.ts — Context-Aware Mock Data Generator
// Sinh mock data tự động theo ngành nghề của account
// ============================================================

export type Industry = 'flowers' | 'jewelry' | 'health' | 'fashion' | 'agriculture' | 'generic';
export type QSRating = 'above' | 'average' | 'below';
export type KeywordHealth = 'good' | 'warning' | 'bad';

export interface KeywordPerformance {
    keyword: string;
    impr: number;
    clicks: number;
    ctr: number;
    cost: number;
    conversions: number;
    cpa: number;
    status: KeywordHealth;
    qualityScore: number;         // 1-10
    expectedCtr: QSRating;
    adRelevance: QSRating;
    landingPageExp: QSRating;
}

export interface ChartDataPoint {
    date: string;
    clicks: number;
    cost: number;
    conversions: number;
    cpa: number;
}

export interface DiagnosticCard {
    type: 'bleeding' | 'qs_warning' | 'relevance_alert' | 'lp_alert' | 'growth' | 'quick_win';
    severity: 'critical' | 'warning' | 'positive';
    title: string;
    body: string;
    action: string;
    keyword: string;
    qualityScore?: number;
}

// ============================================================
// 1. INDUSTRY DETECTION
// ============================================================

const INDUSTRY_KEYWORDS: Record<Industry, string[]> = {
    flowers: ['hoa', 'flower', 'bó hoa', 'cây cảnh', 'shi', 'floral'],
    jewelry: ['jewelry', 'trang sức', 'nhẫn', 'vòng', 'bạc', 'vàng', 'luxury', 'gem', 'diamond'],
    health: ['health', 'sức khỏe', 'thực phẩm', 'vitamin', 'supplement', 'healthy', 'life'],
    fashion: ['fashion', 'thời trang', 'quần áo', 'giày', 'túi', 'dress', 'style'],
    agriculture: ['cây giống', 'nông', 'giống cây', 'phân bón', 'farm', 'seed'],
    generic: [],
};

export function detectIndustry(accountName: string): Industry {
    const name = accountName.toLowerCase();
    for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
        if (industry === 'generic') continue;
        if (keywords.some(kw => name.includes(kw))) {
            return industry as Industry;
        }
    }
    return 'generic';
}

// ============================================================
// 2. KEYWORD PRESETS (Realistic per-industry data)
// ============================================================

interface RawKeyword {
    keyword: string;
    impr: number;
    clicks: number;
    cost: number;
    conversions: number;
    qualityScore: number;
    expectedCtr: QSRating;
    adRelevance: QSRating;
    landingPageExp: QSRating;
}

const KEYWORD_PRESETS: Record<Industry, RawKeyword[]> = {
    flowers: [
        { keyword: 'hoa sáp cao cấp', impr: 2500, clicks: 350, cost: 1500000, conversions: 50, qualityScore: 8, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'above' },
        { keyword: 'cách làm hoa sáp', impr: 5000, clicks: 420, cost: 2100000, conversions: 5, qualityScore: 3, expectedCtr: 'below', adRelevance: 'below', landingPageExp: 'average' },
        { keyword: 'mua hoa sáp ở đâu', impr: 1200, clicks: 180, cost: 720000, conversions: 20, qualityScore: 7, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'average' },
        { keyword: 'hoa sáp giá rẻ', impr: 4500, clicks: 600, cost: 1800000, conversions: 12, qualityScore: 5, expectedCtr: 'average', adRelevance: 'average', landingPageExp: 'below' },
        { keyword: 'hoa sáp tặng mẹ', impr: 800, clicks: 120, cost: 600000, conversions: 18, qualityScore: 9, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'above' },
    ],
    jewelry: [
        { keyword: 'nhẫn bạc 925 nữ', impr: 3200, clicks: 480, cost: 2400000, conversions: 45, qualityScore: 9, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'above' },
        { keyword: 'vòng tay vàng 18k', impr: 2800, clicks: 320, cost: 1920000, conversions: 28, qualityScore: 7, expectedCtr: 'above', adRelevance: 'average', landingPageExp: 'above' },
        { keyword: 'trang sức giá rẻ', impr: 6500, clicks: 780, cost: 3120000, conversions: 8, qualityScore: 3, expectedCtr: 'below', adRelevance: 'below', landingPageExp: 'below' },
        { keyword: 'mua nhẫn cưới ở đâu', impr: 1800, clicks: 270, cost: 1350000, conversions: 32, qualityScore: 8, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'average' },
        { keyword: 'dây chuyền bạc nam', impr: 2100, clicks: 290, cost: 1160000, conversions: 22, qualityScore: 6, expectedCtr: 'average', adRelevance: 'above', landingPageExp: 'below' },
        { keyword: 'bông tai kim cương', impr: 900, clicks: 135, cost: 810000, conversions: 15, qualityScore: 8, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'above' },
    ],
    health: [
        { keyword: 'vitamin tổng hợp', impr: 4200, clicks: 520, cost: 2080000, conversions: 38, qualityScore: 7, expectedCtr: 'above', adRelevance: 'average', landingPageExp: 'above' },
        { keyword: 'thực phẩm chức năng giảm cân', impr: 8500, clicks: 950, cost: 4750000, conversions: 15, qualityScore: 4, expectedCtr: 'average', adRelevance: 'below', landingPageExp: 'below' },
        { keyword: 'omega 3 nhập khẩu', impr: 1500, clicks: 225, cost: 900000, conversions: 30, qualityScore: 9, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'above' },
        { keyword: 'collagen hàn quốc', impr: 3800, clicks: 420, cost: 2100000, conversions: 25, qualityScore: 6, expectedCtr: 'average', adRelevance: 'above', landingPageExp: 'average' },
        { keyword: 'thuốc bổ mắt cho trẻ em', impr: 2200, clicks: 310, cost: 1550000, conversions: 5, qualityScore: 2, expectedCtr: 'below', adRelevance: 'below', landingPageExp: 'below' },
    ],
    fashion: [
        { keyword: 'áo sơ mi nam cao cấp', impr: 3600, clicks: 430, cost: 1720000, conversions: 35, qualityScore: 8, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'above' },
        { keyword: 'váy đầm công sở', impr: 2900, clicks: 380, cost: 1520000, conversions: 28, qualityScore: 7, expectedCtr: 'above', adRelevance: 'average', landingPageExp: 'above' },
        { keyword: 'quần jean rẻ', impr: 7200, clicks: 890, cost: 3560000, conversions: 10, qualityScore: 3, expectedCtr: 'below', adRelevance: 'below', landingPageExp: 'below' },
        { keyword: 'giày sneaker chính hãng', impr: 2400, clicks: 360, cost: 1800000, conversions: 30, qualityScore: 8, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'average' },
        { keyword: 'túi xách nữ thời trang', impr: 1800, clicks: 240, cost: 960000, conversions: 20, qualityScore: 7, expectedCtr: 'average', adRelevance: 'above', landingPageExp: 'above' },
    ],
    agriculture: [
        { keyword: 'cây giống bưởi da xanh', impr: 1800, clicks: 270, cost: 810000, conversions: 22, qualityScore: 8, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'above' },
        { keyword: 'giống xoài thái', impr: 1200, clicks: 156, cost: 468000, conversions: 15, qualityScore: 7, expectedCtr: 'above', adRelevance: 'average', landingPageExp: 'above' },
        { keyword: 'phân bón hữu cơ', impr: 3500, clicks: 420, cost: 1680000, conversions: 8, qualityScore: 4, expectedCtr: 'average', adRelevance: 'below', landingPageExp: 'below' },
        { keyword: 'mua cây ăn trái', impr: 2800, clicks: 340, cost: 1360000, conversions: 28, qualityScore: 7, expectedCtr: 'above', adRelevance: 'above', landingPageExp: 'average' },
        { keyword: 'cách trồng sầu riêng', impr: 6000, clicks: 720, cost: 2880000, conversions: 3, qualityScore: 2, expectedCtr: 'below', adRelevance: 'below', landingPageExp: 'below' },
    ],
    generic: [
        { keyword: 'sản phẩm chất lượng', impr: 3000, clicks: 360, cost: 1440000, conversions: 25, qualityScore: 6, expectedCtr: 'average', adRelevance: 'average', landingPageExp: 'average' },
        { keyword: 'mua hàng online', impr: 5500, clicks: 660, cost: 2640000, conversions: 18, qualityScore: 5, expectedCtr: 'average', adRelevance: 'average', landingPageExp: 'below' },
        { keyword: 'khuyến mãi hôm nay', impr: 8000, clicks: 960, cost: 3840000, conversions: 10, qualityScore: 3, expectedCtr: 'below', adRelevance: 'below', landingPageExp: 'below' },
        { keyword: 'giao hàng nhanh tphcm', impr: 2200, clicks: 330, cost: 990000, conversions: 22, qualityScore: 7, expectedCtr: 'above', adRelevance: 'average', landingPageExp: 'above' },
        { keyword: 'shop uy tín', impr: 1500, clicks: 195, cost: 780000, conversions: 15, qualityScore: 6, expectedCtr: 'average', adRelevance: 'above', landingPageExp: 'average' },
    ],
};

// ============================================================
// 3. GENERATORS
// ============================================================

function determineStatus(cpa: number, conversions: number, qualityScore: number): KeywordHealth {
    if (qualityScore <= 3 || cpa >= 300000) return 'bad';
    if (qualityScore <= 5 || cpa >= 100000) return 'warning';
    return 'good';
}

export function generateKeywordPerformance(industry: Industry): KeywordPerformance[] {
    const rawData = KEYWORD_PRESETS[industry] || KEYWORD_PRESETS.generic;
    
    return rawData.map(kw => {
        const ctr = parseFloat(((kw.clicks / kw.impr) * 100).toFixed(1));
        const cpa = kw.conversions > 0 ? Math.round(kw.cost / kw.conversions) : 0;
        const status = determineStatus(cpa, kw.conversions, kw.qualityScore);

        return {
            keyword: kw.keyword,
            impr: kw.impr,
            clicks: kw.clicks,
            ctr,
            cost: kw.cost,
            conversions: kw.conversions,
            cpa,
            status,
            qualityScore: kw.qualityScore,
            expectedCtr: kw.expectedCtr,
            adRelevance: kw.adRelevance,
            landingPageExp: kw.landingPageExp,
        };
    });
}

// Chart data — varies by industry base volumes
const CHART_MULTIPLIERS: Record<Industry, { clickBase: number; convRate: number; cpcBase: number }> = {
    flowers:     { clickBase: 150, convRate: 0.12, cpcBase: 4500 },
    jewelry:     { clickBase: 200, convRate: 0.10, cpcBase: 5500 },
    health:      { clickBase: 180, convRate: 0.08, cpcBase: 4800 },
    fashion:     { clickBase: 220, convRate: 0.09, cpcBase: 4200 },
    agriculture: { clickBase: 120, convRate: 0.11, cpcBase: 3500 },
    generic:     { clickBase: 160, convRate: 0.10, cpcBase: 4000 },
};

const DAY_VARIATION = [0.75, 0.9, 1.15, 0.85, 1.25, 1.5, 1.1]; // Mon-Sun pattern

export function generateChartData(industry: Industry): ChartDataPoint[] {
    const { clickBase, convRate, cpcBase } = CHART_MULTIPLIERS[industry] || CHART_MULTIPLIERS.generic;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return days.map((date, i) => {
        const clicks = Math.round(clickBase * DAY_VARIATION[i]);
        const cost = clicks * cpcBase;
        const conversions = Math.max(1, Math.round(clicks * convRate * (0.7 + Math.random() * 0.6)));
        const cpa = conversions > 0 ? Math.round(cost / conversions) : 0;

        return { date, clicks, cost, conversions, cpa };
    });
}

// ============================================================
// 4. AI DIAGNOSTICIAN V2
// ============================================================

export function generateAIDiagnostics(industry: Industry, keywords: KeywordPerformance[]): DiagnosticCard[] {
    const cards: DiagnosticCard[] = [];

    // Sort by CPA descending to find worst performers first
    const sorted = [...keywords].sort((a, b) => b.cpa - a.cpa);

    for (const kw of sorted) {
        // BLEEDING: QS ≤ 3 AND high CPA
        if (kw.qualityScore <= 3 && kw.cpa >= 200000) {
            const reasons: string[] = [];
            if (kw.expectedCtr === 'below') reasons.push('Expected CTR thấp');
            if (kw.adRelevance === 'below') reasons.push('Ad không liên quan keyword');
            if (kw.landingPageExp === 'below') reasons.push('Landing page chưa tối ưu');
            
            cards.push({
                type: 'bleeding',
                severity: 'critical',
                title: 'Bleeding Alert — QS Critically Low',
                body: `Keyword "${kw.keyword}" có Quality Score ${kw.qualityScore}/10, CPA lên tới ₫ ${kw.cpa.toLocaleString()}. ${kw.conversions} Conv. trên ${kw.impr.toLocaleString()} Impr. — hiệu suất cực kém.${reasons.length > 0 ? ` Nguyên nhân: ${reasons.join(', ')}.` : ''}`,
                action: 'Negate hoặc pause ngay. QS quá thấp khiến Google tăng CPC phạt.',
                keyword: kw.keyword,
                qualityScore: kw.qualityScore,
            });
            continue;
        }

        // QS WARNING: QS 4-5 with below expected CTR
        if (kw.qualityScore >= 4 && kw.qualityScore <= 5 && kw.expectedCtr === 'below') {
            cards.push({
                type: 'qs_warning',
                severity: 'warning',
                title: 'Quality Score Warning',
                body: `"${kw.keyword}" đạt QS ${kw.qualityScore}/10. Expected CTR đang Below Average — ad copy có thể chưa đủ hấp dẫn hoặc keyword quá chung chung. CPA hiện tại: ₫ ${kw.cpa.toLocaleString()}.`,
                action: 'Viết lại headline chứa keyword chính xác. Test 2-3 description mới.',
                keyword: kw.keyword,
                qualityScore: kw.qualityScore,
            });
            continue;
        }

        // RELEVANCE ALERT: Ad relevance below
        if (kw.adRelevance === 'below' && kw.qualityScore <= 5) {
            cards.push({
                type: 'relevance_alert',
                severity: 'warning',
                title: 'Ad Relevance Mismatch',
                body: `"${kw.keyword}" có Ad Relevance = Below Average. Nội dung quảng cáo chưa khớp với từ khóa, Google cho điểm thấp (QS ${kw.qualityScore}/10).`,
                action: 'Đưa keyword vào headline (H1 hoặc H2). Đảm bảo description có chứa keyword variant.',
                keyword: kw.keyword,
                qualityScore: kw.qualityScore,
            });
            continue;
        }

        // LP ALERT: Landing page below but other factors OK
        if (kw.landingPageExp === 'below' && kw.qualityScore >= 5) {
            cards.push({
                type: 'lp_alert',
                severity: 'warning',
                title: 'Landing Page Cần Cải Thiện',
                body: `"${kw.keyword}" có QS ${kw.qualityScore}/10, nhưng Landing Page Experience = Below Average. Đây là yếu tố kéo QS xuống. CPA ₫ ${kw.cpa.toLocaleString()} sẽ giảm nếu fix LP.`,
                action: 'Cải thiện tốc độ tải trang, thêm nội dung liên quan đến keyword, đảm bảo mobile-friendly.',
                keyword: kw.keyword,
                qualityScore: kw.qualityScore,
            });
            continue;
        }

        // GROWTH: QS ≥ 8 + good conversions
        if (kw.qualityScore >= 8 && kw.conversions >= 15) {
            cards.push({
                type: 'growth',
                severity: 'positive',
                title: 'Growth Opportunity',
                body: `"${kw.keyword}" đem lại ${kw.conversions} Conv. với CPA ₫ ${kw.cpa.toLocaleString()} và QS xuất sắc ${kw.qualityScore}/10. Đây là keyword vàng.`,
                action: 'Tăng 15-20% Bid Cap. Cân nhắc mở rộng sang Broad Match để bắt thêm traffic.',
                keyword: kw.keyword,
                qualityScore: kw.qualityScore,
            });
            continue;
        }

        // QUICK WIN: Average QS but fixable LP
        if (kw.qualityScore >= 5 && kw.qualityScore <= 7 && kw.landingPageExp !== 'above' && kw.conversions >= 10) {
            cards.push({
                type: 'quick_win',
                severity: 'positive',
                title: 'Quick Win — Tối ưu LP để tăng QS',
                body: `"${kw.keyword}" đang có ${kw.conversions} Conv. với QS ${kw.qualityScore}/10. Landing Page chưa tối ưu — nếu cải thiện LP, QS có thể tăng 2-3 điểm → CPC giảm đáng kể.`,
                action: 'Tối ưu trang đích: thêm nội dung liên quan, cải thiện tốc độ load, CTA rõ ràng.',
                keyword: kw.keyword,
                qualityScore: kw.qualityScore,
            });
            continue;
        }
    }

    // Limit to top 4 most impactful cards
    return cards.slice(0, 4);
}

// ============================================================
// 5. MASTER GENERATOR — One call to get everything
// ============================================================

export interface DashboardMockData {
    industry: Industry;
    keywords: KeywordPerformance[];
    chartData: ChartDataPoint[];
    diagnostics: DiagnosticCard[];
}

export function generateDashboardData(accountName: string): DashboardMockData {
    const industry = detectIndustry(accountName);
    const keywords = generateKeywordPerformance(industry);
    const chartData = generateChartData(industry);
    const diagnostics = generateAIDiagnostics(industry, keywords);

    return { industry, keywords, chartData, diagnostics };
}

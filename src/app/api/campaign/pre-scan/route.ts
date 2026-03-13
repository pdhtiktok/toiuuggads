import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const { url, settings } = await req.json();

    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing URL' }), { status: 400 });
    }

    // --- STEP 1: SIMULATE AI SCANNING ---
    // In real implementation, this would call Gemini/GPT with the scraped URL content
    // We only do this ONCE to save tokens.
    
    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 1000));

    const mockAIData = {
        theme: "Premium Gift Shop - Flowers, Jewelry & Supplements",
        adGroups: [
            {
                name: "NHÓM: HOA SÁP CAO CẤP",
                keywords: [
                    // CORE KEYWORDS
                    { text: "hoa sáp thơm tphcm", avgCpc: 4500, volume: 1200, trend: 'up', category: 'core' },
                    { text: "shop hoa sáp online", avgCpc: 3800, volume: 850, trend: 'steady', category: 'core' },
                    { text: "đặt hoa sáp theo yêu cầu", avgCpc: 4000, volume: 450, trend: 'up', category: 'core' },
                    // SUGGESTED
                    { text: "hoa sáp giá rẻ sinh viên", avgCpc: 2500, volume: 2400, trend: 'down', category: 'suggested' },
                    { text: "tặng hoa sáp tận nơi", avgCpc: 4200, volume: 320, trend: 'up', category: 'suggested' },
                    { text: "mẫu bó hoa sáp đẹp 2024", avgCpc: 3100, volume: 590, trend: 'up', category: 'suggested' },
                    { text: "quà tặng hoa sáp vĩnh cửu", avgCpc: 4800, volume: 150, trend: 'steady', category: 'suggested' },
                    { text: "hoa sáp nhũ kim tuyến", avgCpc: 3900, volume: 720, trend: 'down', category: 'suggested' }
                ],
                headlines: ["Hoa Sáp Thơm Cao Cấp TPHCM", "Giao Nhanh Nội Thành 2H", "Hoa Sáp Giá Tốt Shiper"],
                descriptions: ["Hoa sáp lưu hương lâu, bền đẹp vượt thời gian. Tặng kèm thiệp thiết kế cực xinh xắn."]
            },
            {
                name: "NHÓM: QUÀ TẶNG GẤU BÔNG",
                keywords: [
                    { text: "hoa gấu bông tphcm", avgCpc: 6000, volume: 900, trend: 'up', category: 'core' },
                    { text: "gấu bông kèm hoa sáp", avgCpc: 5500, volume: 600, trend: 'up', category: 'core' },
                    { text: "set quà gấu bông đẹp", avgCpc: 7000, volume: 300, trend: 'steady', category: 'core' },
                    { text: "gấu dâu kèm hoa", avgCpc: 6500, volume: 1200, trend: 'up', category: 'suggested' },
                    { text: "thú bông tốt nghiệp giá rẻ", avgCpc: 3000, volume: 3500, trend: 'up', category: 'suggested' }
                ],
                headlines: ["Set Quà Gấu Bông Siêu Xinh", "Quà Tặng Ý Nghĩa Tận Tâm", "Mẫu Gấu Bông Hot nhất 2024"],
                descriptions: ["Đa dạng các mẫu gấu bông, gấu dâu Lotso cực hot kèm hoa sáp thơm. Miễn phí túi quà."]
            }
        ],
        globalAssets: {
            sitelinks: [
                { title: "Mẫu hoa bó mới", desc: "BST Hoa sáp hot nhất 2024" },
                { title: "Quà tặng gấu bông", desc: "Quà tặng ý nghĩa cho người yêu" },
                { title: "BST Trang sức", desc: "Phụ kiện bạc cao cấp" }
            ],
            callout: ["Giao hàng 2h", "Miễn phí thiệp", "Mở cửa 24/7", "Đổi trả 7 ngày"]
        }
    };

    return new Response(JSON.stringify(mockAIData), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

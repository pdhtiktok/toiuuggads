import { NextRequest } from 'next/server';
import { getGoogleAdsCustomer } from '@/lib/google-ads';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const customerId = req.nextUrl.searchParams.get('customerId');
    const campaignId = req.nextUrl.searchParams.get('campaignId');

    if (!customerId || !campaignId) {
        return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    try {
        const customer = getGoogleAdsCustomer(customerId);
        
        // Query to get keyword performance
        const query = `
            SELECT 
                ad_group_criterion.keyword.text, 
                ad_group_criterion.keyword.match_type,
                metrics.clicks, 
                metrics.impressions, 
                metrics.ctr, 
                metrics.average_cpc, 
                metrics.conversions,
                metrics.cost_micros
            FROM keyword_view
            WHERE campaign.id = ${campaignId}
              AND segments.date DURING LAST_30_DAYS
            ORDER BY metrics.cost_micros DESC
            LIMIT 50
        `;

        const keywords = await customer.query(query);

        return new Response(JSON.stringify(keywords), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

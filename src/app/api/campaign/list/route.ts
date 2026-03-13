import { NextRequest } from 'next/server';
import { getGoogleAdsCustomer } from '@/lib/google-ads';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const customerId = req.nextUrl.searchParams.get('customerId');

    if (!customerId) {
        return new Response(JSON.stringify({ error: 'Missing customerId' }), { status: 400 });
    }

    try {
        const customer = getGoogleAdsCustomer(customerId);
        
        // This is a minimal query just to populate the campaign selector
        const query = `
            SELECT 
                campaign.id, 
                campaign.name, 
                campaign.status, 
                metrics.clicks, 
                metrics.cost_micros, 
                metrics.conversions 
            FROM campaign 
            WHERE segments.date DURING LAST_30_DAYS
            LIMIT 50
        `;

        const campaigns = await customer.query(query);

        return new Response(JSON.stringify(campaigns), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

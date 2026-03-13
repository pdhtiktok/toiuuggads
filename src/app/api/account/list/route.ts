import { NextRequest } from 'next/server';
import { GoogleAdsApi } from 'google-ads-api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const client = new GoogleAdsApi({
            client_id: process.env.CLIENT_ID || '',
            client_secret: process.env.CLIENT_SECRET || '',
            developer_token: process.env.DEVELOPER_TOKEN || '',
        });

        const refreshToken = process.env.REFRESH_TOKEN || '';
        const customers = await client.listAccessibleCustomers(refreshToken) as any;
        
        // Ensure we are working with an array of resource names
        const accountIds = Array.isArray(customers) ? customers : (customers.resource_names || []);

        const formattedCustomers = accountIds.map((id: string) => ({
            id: id.replace('customers/', ''),
            name: `AD ACCOUNT - ${id.slice(-4)}`,
            descriptiveName: id === `customers/${process.env.MANAGER_CUSTOMER_ID}` ? "MCC Manager Account" : "Client Sub-account"
        }));

        // MOCK DATA for 3 Specific Domains (As requested for Demo)
        const demoAccounts = [
            { id: "8724267745", name: "SHOP HOA NHÀ SHI", descriptiveName: "Ngành Hoa Tươi" },
            { id: "1122334455", name: "LUXURY JEWELRY VN", descriptiveName: "Bán lẻ Trang sức" },
            { id: "9988776655", name: "HEALTHY LIFE PLUS", descriptiveName: "Thực phẩm Chức năng" }
        ];

        // Combine API data with Demo data for the best experience
        const finalAccounts = [...demoAccounts, ...formattedCustomers];

        return new Response(JSON.stringify(finalAccounts), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("Account List Error:", error);
        // Even on error, return the 3 requested demo accounts
        const demoAccounts = [
            { id: "8724267745", name: "SHOP HOA NHÀ SHI", descriptiveName: "Ngành Hoa Tươi" },
            { id: "1122334455", name: "LUXURY JEWELRY VN", descriptiveName: "Bán lẻ Trang sức" },
            { id: "9988776655", name: "HEALTHY LIFE PLUS", descriptiveName: "Thực phẩm Chức năng" }
        ];
        return new Response(JSON.stringify(demoAccounts), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

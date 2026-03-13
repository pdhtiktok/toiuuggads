import { GoogleAdsApi } from 'google-ads-api';

const client = new GoogleAdsApi({
    client_id: process.env.CLIENT_ID || '',
    client_secret: process.env.CLIENT_SECRET || '',
    developer_token: process.env.DEVELOPER_TOKEN || '',
});

export function getGoogleAdsCustomer(customerId: string) {
    return client.Customer({
        customer_id: customerId,
        refresh_token: process.env.REFRESH_TOKEN || '',
        login_customer_id: process.env.MANAGER_CUSTOMER_ID || '',
    });
}

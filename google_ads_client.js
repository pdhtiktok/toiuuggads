require('dotenv').config();
const { GoogleAdsApi } = require('google-ads-api');

const client = new GoogleAdsApi({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    developer_token: process.env.DEVELOPER_TOKEN,
});

/**
 * Get a customer instance
 * @param {string} customerId - The 10-digit customer ID of the target account
 */
function getCustomer(customerId) {
    return client.Customer({
        customer_id: customerId,
        refresh_token: process.env.REFRESH_TOKEN,
        login_customer_id: process.env.MANAGER_CUSTOMER_ID, // Use MCC as the login gateway
    });
}

/**
 * List all accessible customers for this account
 */
async function listAccessibleCustomers() {
    try {
        const customers = await client.listAccessibleCustomers(process.env.REFRESH_TOKEN);
        console.log('Accessible Customers:', customers);
        return customers;
    } catch (error) {
        console.error('Error listing customers:', error);
    }
}

module.exports = {
    client,
    getCustomer,
    listAccessibleCustomers
};

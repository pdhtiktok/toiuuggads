require('dotenv').config();
const { getCustomer, listAccessibleCustomers } = require('./google_ads_client');

async function run() {
    console.log("--- GOOGLE ADS CUSTOM ENGINE START ---");

    const mccId = process.env.MANAGER_CUSTOMER_ID;
    if (!mccId) {
        console.error("ERROR: Please set MANAGER_CUSTOMER_ID in your .env file.");
        return;
    }

    console.log(`Connecting via MCC: ${mccId}...`);

    try {
        // 1. List sub-accounts under this MCC
        await listSubAccounts(mccId);
        
        // 2. Example: If you want to audit a specific child account, uncomment and replace ID:
        // await auditCampaigns('8724267745'); 

    } catch (error) {
        console.error("Execution failed:", error.message);
    }
}

/**
 * List all client accounts linked to the MCC (including nested MCCs)
 */
async function listSubAccounts(mccId) {
    const mcc = getCustomer(mccId);
    
    console.log(`\n🔍 DEEP SCANNING: Searching all client accounts under MCC ${mccId}...`);

    // Fetching all descendants, filtering for accounts that are NOT managers
    const subAccounts = await mcc.query(`
        SELECT 
            customer_client.id, 
            customer_client.descriptive_name, 
            customer_client.manager,
            customer_client.level,
            customer_client.status
        FROM customer_client
        WHERE customer_client.manager = false
          AND customer_client.status = 'ENABLED'
    `);

    console.log("\n--- READY TO ADVERTISE (CLIENT ACCOUNTS) ---");
    if (subAccounts.length === 0) {
        console.log("No client accounts found. Ensure your MCC has linked sub-accounts.");
        return;
    }

    console.table(subAccounts.map(c => ({
        ID: c.customer_client.id,
        Name: c.customer_client.descriptive_name || 'No Name',
        Level: c.customer_client.level, // Level 1 is direct, Level 2+ is nested
        Status: c.customer_client.status
    })));
}

async function auditCampaigns(customerId) {
    const customer = getCustomer(customerId);
    
    console.log(`\n--- AUDITING CHILD ACCOUNT: ${customerId} ---`);

    const campaigns = await customer.report({
        entity: 'campaign',
        attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
        metrics: ['metrics.clicks', 'metrics.cost_micros', 'metrics.conversions'],
        constraints: {
            'campaign.status': 'ENABLED',
        },
        limit: 10,
    });

    if (campaigns.length === 0) {
        console.log("No enabled campaigns found in this account.");
        return;
    }

    console.table(campaigns.map(c => ({
        Name: c.campaign.name,
        Status: c.campaign.status,
        Clicks: c.metrics.clicks,
        Conversions: c.metrics.conversions,
        Cost: (c.metrics.cost_micros / 1000000).toLocaleString() + ' VND'
    })));
}

run();

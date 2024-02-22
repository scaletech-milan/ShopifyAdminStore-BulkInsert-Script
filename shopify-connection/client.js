const { createAdminRestApiClient } = require('@shopify/admin-api-client');
const dotenv = require('dotenv');
dotenv.config();

let client = createAdminRestApiClient({
    storeDomain: process.env.STORE_DOMAIN,
    apiVersion: process.env.API_VERSION,
    accessToken: process.env.ACCESS_TOKEN,
});

module.exports = client

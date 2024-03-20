const { createAdminRestApiClient } = require("@shopify/admin-api-client");
const dotenv = require("dotenv");
dotenv.config();

const MAX_RETRIES = 5;
let retryCount = 0;

function createApiClient() {
  try {
    const client = createAdminRestApiClient({
      storeDomain: process.env.STORE_DOMAIN1,
      apiVersion: process.env.API_VERSION1,
      accessToken: process.env.ACCESS_TOKEN1,
    });
    return client;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.error(`Error creating API client: ${error.message}. Retrying...`);
      retryCount++;
      return createApiClient(); // Retry the client creation recursively
    } else {
      console.error(`Max retry attempts reached. Unable to create API client.`);
      return null;
    }
  }
}

module.exports = createApiClient();

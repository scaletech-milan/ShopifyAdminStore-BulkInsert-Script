const express = require('express');
const fs = require('fs').promises;
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const client = require('./shopify-connection/client');

app.use(express.json());

app.get('/products', async (req, res) => {
    try {
        const numberOfRequest = 5;
        for (let i = 1; i <= numberOfRequest; i++) {
            const response = await client.get("/products/7667583287493");
            if (response.ok) {
                const body = await response.json();
                const strRespData = JSON.stringify(body, null, 2);
                const jsonRespData = JSON.parse(strRespData);

                console.log(`Get product successfully. ID: ${jsonRespData['product']['id']} & Request: ${i}} `);

                // res.send(`${ jsonRespData } `);
            }
            else {
                console.error("Failed to fetch product:", response.statusText);
            }
        }
        res.send("Ok")
    } catch (error) {
        console.error("Error while getting a product:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/products', async (req, res) => {
    try {
        const numberOfProducts = 1; // Define the number of products you want to insert
        const startFrom = 1; // Edit based on already added jacket records (For maintaining sequence in store)
        let insertedRecords = []

        for (let i = startFrom; i <= numberOfProducts + startFrom; i++) {
            const body = {
                product: {
                    title: `Jacket ${i} `
                }
            };
            const response = await client.post("/products", { data: body });

            if (response.ok) {
                const responseBody = await response.json();
                console.log(`Product ${i} inserted successfully.ID: ${responseBody.product.id} `);
                insertedRecords.push(responseBody.product.id)
            } else {
                console.error(`Failed to insert product ${i}: `, response.statusText);
            }
        }

        // Append the inserted records to the file
        await appendToInsertedProducts(insertedRecords);

        res.send(`${insertedRecords}`);
    } catch (error) {
        console.error("Error while inserting products:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.put('/products', async (req, res) => {
    try {
        const numberOfProducts = 2; // Define the number of products you want to update

        for (let i = 1; i <= numberOfProducts; i++) {
            const body = {
                product: {
                    title: `Leather Jacket`
                }
            };
            const response = await client.put("/products/7667583287493", { data: body });

            if (response.ok) {
                const responseBody = await response.json();
                console.log(`Product ${i} updated successfully. ID: ${responseBody.product.id} `);
            } else {
                console.error(`Failed to update product ${i}: `, response.statusText);
            }
        }
        res.send("Updated");
    } catch (error) {
        console.error("Error while updating product:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.delete('/products', async (req, res) => {
    try {
        // Read the inserted products from the file
        const insertedProducts = await fs.readFile('insertedProducts.json', 'utf8');
        const productIds = JSON.parse(insertedProducts);

        for (const productId of productIds) {
            const response = await client.delete(`/products/${productId}`);
            console.log("\n response", response)
            if (response.ok) {
                console.log(`Product ${productId} deleted successfully.`);
            } else {
                console.error(`Failed to delete product ${productId}: `, response.statusText);
            }
        }
        // Empty the file after deleting all records
        await fs.writeFile('insertedProducts.json', '[]');

        res.send("Deleted all products listed in the insertedProducts.json file.");
    } catch (error) {
        console.error("Error while deleting products:", error);
        res.status(500).send("Internal Server Error");
    }
})

// Function to append inserted records to the file
async function appendToInsertedProducts(insertedRecords) {
    try {
        const existingRecords = await fs.readFile('insertedProducts.json', 'utf8');
        const existingProductIds = JSON.parse(existingRecords);
        const updatedProductIds = existingProductIds.concat(insertedRecords);
        await fs.writeFile('insertedProducts.json', JSON.stringify(updatedProductIds));
    } catch (error) {
        console.error("Error while appending inserted records:", error);
        throw error;
    }
}

app.listen(port, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + port)
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
}
);

const express = require("express");
const fs = require("fs").promises;
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const client = require("./shopify-connection/client");
const insertProductVariants = require("./sample-data/insert_variants_data");
const insertProductImages = require("./sample-data/insert_images_data");
const updateProductVariants = require("./sample-data/update_variants_data");
const updateProductImages = require("./sample-data/update_images_data");

console.log("Length of insertProductVariants:- ", insertProductVariants.length);
console.log("Length of insertProductImages:- ", insertProductImages.length);

app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const numberOfRequest = 5;
    for (let i = 1; i <= numberOfRequest; i++) {
      const response = await client.get("/products/7667583287493");
      if (response.ok) {
        const body = await response.json();
        const strRespData = JSON.stringify(body, null, 2);
        const jsonRespData = JSON.parse(strRespData);

        console.log(
          `Get product successfully. ID: ${jsonRespData["product"]["id"]} & Request: ${i}} `
        );

        // res.send(`${ jsonRespData } `);
      } else {
        console.error("Failed to fetch product:", response.statusText);
      }
    }
    res.send("Ok");
  } catch (error) {
    console.error("Error while getting a product:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/products", async (req, res) => {
  try {
    const numberOfProducts = 0; // Define the number of products you want to insert
    const startFrom = 1; // Edit based on already added jacket records (For maintaining sequence in store)
    let insertedRecords = [];

    for (let i = startFrom; i <= numberOfProducts + startFrom; i++) {
      const body = {
        product: {
          title: `GRASIC ${i}`,
          body_html:
            "<p>Made from our softest poly-cotton fabric ever produced, these Polos offer unbeatable comfort and durability.</p>\n<p>Featuring a structured collar and branded buttons, our Polos deliver a sophisticated and refined look, perfect for any occasion. With the same signature tailored fit that our customers know and love, these Polos are designed to flatter your physique while still allowing for maximum freedom of movement.</p>\n<p>Our Polos also feature a printed neck label, ensuring maximum comfort throughout the day. Whether you're in the office, on the golf course, or enjoying a night out, these Polos will keep you looking and feeling your best.</p>",
          vendor: "INTO THE AM",
          product_type: "Men's Polos",
          created_at: "2022-10-26T13:43:52-07:00",
          handle: "basic-polo",
          updated_at: "2024-03-12T02:25:45-07:00",
          published_at: "2023-04-10T09:34:13-07:00",
          template_suffix: "polos",
          published_scope: "global",
          tags: "2-16 new styles, 2XL, 3XL, 4XL, ADS, Basic, Basic Polos, Basics, Basics ADS, Black, Blue, Branded, Branded Basics, Brown, Essential Polo 3 Pack CustomV1 Bundle, Essential Polo 3 Pack CustomV2 Bundle, Essential Polo 6 Pack CustomV1 Bundle, Essential Polo 6 Pack CustomV2 Bundle, Fit-73, full-price, Green, Grey, Grin, Henleys, High Margin, L, M, multi-color, Navy, new-item, PLA, Polo, Polos, Premium Apparel, Red, RTS, S, Short Sleeve, Spring 2024, web best sellers, White, XL",
          variants: insertProductVariants,
          options: [
            {
              name: "Color",
              position: 1,
              values: [
                "Black",
                "Indigo",
                "Navy",
                "Olive Green",
                "Grey",
                "White",
                "Charcoal",
                "Maroon",
                "Forest Green",
                "Light Blue",
                "Mint",
                "Red",
                "Cream",
                "Royal Blue",
              ],
            },
            {
              name: "Size",
              position: 2,
              values: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
            },
          ],
          images: [insertProductImages],
          image: {
            position: 1,
            created_at: "2023-04-10T08:39:55-07:00",
            updated_at: "2023-04-10T08:40:01-07:00",
            alt: "Basic Polo-Black-Front",
            width: 1001,
            height: 1250,
            src: "https://cdn.shopify.com/s/files/1/0182/4159/products/ITAM_Basic_Mens_Polo_Black.jpg?v=1681141201",
          },
        },
      };
      const response = await client.post("/products", { data: body });

      if (response.ok) {
        const responseBody = await response.json();
        console.log(
          `Product ${i} ==== ${responseBody.product.title} ==== ${i} inserted successfully.ID: ${responseBody.product.id} `
        );
        insertedRecords.push(responseBody.product.id);
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
});

app.put("/products", async (req, res) => {
  try {
    const numberOfProducts = 1; // Define the number of products you want to update

    for (let i = 1; i <= numberOfProducts; i++) {
      const body = {
        product: {
          title: `MICY ${i}`,
          body_html:
            "<p>Made from our softest poly-cotton fabric ever produced, these Polos offer unbeatable comfort and durability.</p>\n<p>Featuring a structured collar and branded buttons, our Polos deliver a sophisticated and refined look, perfect for any occasion. With the same signature tailored fit that our customers know and love, these Polos are designed to flatter your physique while still allowing for maximum freedom of movement.</p>\n<p>Our Polos also feature a printed neck label, ensuring maximum comfort throughout the day. Whether you're in the office, on the golf course, or enjoying a night out, these Polos will keep you looking and feeling your best.</p>",
          vendor: "INTO THE AM",
          product_type: "Men's Polos",
          created_at: "2022-10-26T13:43:52-07:00",
          handle: "basic-polo",
          updated_at: "2024-03-12T02:25:45-07:00",
          published_at: "2023-04-10T09:34:13-07:00",
          template_suffix: "polos",
          published_scope: "global",
          tags: "2-16 new styles, 2XL, 3XL, 4XL, ADS, Basic, Basic Polos, Basics, Basics ADS, Black, Blue, Branded, Branded Basics, Brown, Essential Polo 3 Pack CustomV1 Bundle, Essential Polo 3 Pack CustomV2 Bundle, Essential Polo 6 Pack CustomV1 Bundle, Essential Polo 6 Pack CustomV2 Bundle, Fit-73, full-price, Green, Grey, Grin, Henleys, High Margin, L, M, multi-color, Navy, new-item, PLA, Polo, Polos, Premium Apparel, Red, RTS, S, Short Sleeve, Spring 2024, web best sellers, White, XL",
          variants: updateProductVariants,
          options: [
            {
              name: "Color",
              position: 1,
              values: [
                "Black",
                "Indigo",
                "Navy",
                "Olive Green",
                "Grey",
                "White",
                "Charcoal",
                "Maroon",
                "Forest Green",
                "Light Blue",
                "Mint",
                "Red",
                "Cream",
                "Royal Blue",
              ],
            },
            {
              name: "Size",
              position: 2,
              values: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
            },
          ],
          images: [updateProductImages],
          image: {
            position: 1,
            created_at: "2023-04-10T08:39:55-07:00",
            updated_at: "2023-04-10T08:40:01-07:00",
            alt: "Basic Polo-Black-Front",
            width: 1001,
            height: 1250,
            src: "https://cdn.shopify.com/s/files/1/0182/4159/products/ITAM_Basic_Mens_Polo_Black.jpg?v=1681141201",
          },
        },
      };
      const response = await client.put("/products/7948377424062", {
        data: body,
      });

      if (response.ok) {
        const responseBody = await response.json();
        console.log(
          `Product ${i} updated successfully. ID: ${responseBody.product.id} `
        );
      } else {
        console.error(`Failed to update product ${i}: `, response.statusText);
      }
    }
    res.send("Updated");
  } catch (error) {
    console.error("Error while updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/products", async (req, res) => {
  try {
    // Read the inserted products from the file
    const insertedProducts = await fs.readFile("insertedProducts.json", "utf8");
    const productIds = JSON.parse(insertedProducts);

    for (const productId of productIds) {
      const response = await client.delete(`/products/${productId}`);
      // console.log("\n response", response);
      if (response.ok) {
        console.log(`Product ${productId} deleted successfully.`);
      } else {
        console.error(
          `Failed to delete product ${productId}: `,
          response.statusText
        );
      }
    }
    // Empty the file after deleting all records
    await fs.writeFile("insertedProducts.json", "[]");

    res.send("Deleted all products listed in the insertedProducts.json file.");
  } catch (error) {
    console.error("Error while deleting products:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to append inserted records to the file
async function appendToInsertedProducts(insertedRecords) {
  try {
    const existingRecords = await fs.readFile("insertedProducts.json", "utf8");
    const existingProductIds = JSON.parse(existingRecords);
    const updatedProductIds = existingProductIds.concat(insertedRecords);
    await fs.writeFile(
      "insertedProducts.json",
      JSON.stringify(updatedProductIds)
    );
  } catch (error) {
    console.error("Error while appending inserted records:", error);
    throw error;
  }
}

async function manipulate10kProducts() {
  try {
    // Inserting 3500 records
    const numberOfInserts = 3500;
    const insertedRecordIds = [];

    for (let i = 1; i <= numberOfInserts; i++) {
      const body = {
        product: {
          title: `CLASSIC ${i}`,
          body_html:
            "<p>Made from our softest poly-cotton fabric ever produced, these Polos offer unbeatable comfort and durability.</p>\n<p>Featuring a structured collar and branded buttons, our Polos deliver a sophisticated and refined look, perfect for any occasion. With the same signature tailored fit that our customers know and love, these Polos are designed to flatter your physique while still allowing for maximum freedom of movement.</p>\n<p>Our Polos also feature a printed neck label, ensuring maximum comfort throughout the day. Whether you're in the office, on the golf course, or enjoying a night out, these Polos will keep you looking and feeling your best.</p>",
          vendor: "INTO THE AM",
          product_type: "Men's Polos",
          created_at: "2022-10-26T13:43:52-07:00",
          handle: "basic-polo",
          updated_at: "2024-03-12T02:25:45-07:00",
          published_at: "2023-04-10T09:34:13-07:00",
          template_suffix: "polos",
          published_scope: "global",
          tags: "2-16 new styles, 2XL, 3XL, 4XL, ADS, Basic, Basic Polos, Basics, Basics ADS, Black, Blue, Branded, Branded Basics, Brown, Essential Polo 3 Pack CustomV1 Bundle, Essential Polo 3 Pack CustomV2 Bundle, Essential Polo 6 Pack CustomV1 Bundle, Essential Polo 6 Pack CustomV2 Bundle, Fit-73, full-price, Green, Grey, Grin, Henleys, High Margin, L, M, multi-color, Navy, new-item, PLA, Polo, Polos, Premium Apparel, Red, RTS, S, Short Sleeve, Spring 2024, web best sellers, White, XL",
          variants: insertProductVariants,
          options: [
            {
              name: "Color",
              position: 1,
              values: [
                "Black",
                "Indigo",
                "Navy",
                "Olive Green",
                "Grey",
                "White",
                "Charcoal",
                "Maroon",
                "Forest Green",
                "Light Blue",
                "Mint",
                "Red",
                "Cream",
                "Royal Blue",
              ],
            },
            {
              name: "Size",
              position: 2,
              values: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
            },
          ],
          images: [insertProductImages],
          image: {
            position: 1,
            created_at: "2023-04-10T08:39:55-07:00",
            updated_at: "2023-04-10T08:40:01-07:00",
            alt: "Basic Polo-Black-Front",
            width: 1001,
            height: 1250,
            src: "https://cdn.shopify.com/s/files/1/0182/4159/products/ITAM_Basic_Mens_Polo_Black.jpg?v=1681141201",
          },
        },
      };
      const response = await client.post("/products", { data: body });

      if (response.ok) {
        const responseBody = await response.json();
        console.log(
          `Product ${i} inserted successfully. ID: ${responseBody.product.id}`
        );
        insertedRecordIds.push(responseBody.product.id);

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Sleep for 1 Seconds
      } else {
        console.error(`Failed to insert product ${i}: `, response.statusText);
      }
    }

    // Updating 3500 records
    const numberOfUpdates = 1;

    for (const productId of insertedRecordIds) {
      for (let i = 1; i <= numberOfUpdates; i++) {
        const body = {
          product: {
            title: `CLASSIC 350 ${i} ${productId}`,
            body_html:
              "<p>Made from our softest poly-cotton fabric ever produced, these Polos offer unbeatable comfort and durability.</p>\n<p>Featuring a structured collar and branded buttons, our Polos deliver a sophisticated and refined look, perfect for any occasion. With the same signature tailored fit that our customers know and love, these Polos are designed to flatter your physique while still allowing for maximum freedom of movement.</p>\n<p>Our Polos also feature a printed neck label, ensuring maximum comfort throughout the day. Whether you're in the office, on the golf course, or enjoying a night out, these Polos will keep you looking and feeling your best.</p>",
            vendor: "INTO THE AM",
            product_type: "Men's Polos",
            created_at: "2022-10-26T13:43:52-07:00",
            handle: "basic-polo",
            updated_at: "2024-03-12T02:25:45-07:00",
            published_at: "2023-04-10T09:34:13-07:00",
            template_suffix: "polos",
            published_scope: "global",
            tags: "2-16 new styles, 2XL, 3XL, 4XL, ADS, Basic, Basic Polos, Basics, Basics ADS, Black, Blue, Branded, Branded Basics, Brown, Essential Polo 3 Pack CustomV1 Bundle, Essential Polo 3 Pack CustomV2 Bundle, Essential Polo 6 Pack CustomV1 Bundle, Essential Polo 6 Pack CustomV2 Bundle, Fit-73, full-price, Green, Grey, Grin, Henleys, High Margin, L, M, multi-color, Navy, new-item, PLA, Polo, Polos, Premium Apparel, Red, RTS, S, Short Sleeve, Spring 2024, web best sellers, White, XL",
            variants: updateProductVariants,
            options: [
              {
                name: "Color",
                position: 1,
                values: [
                  "Black",
                  "Indigo",
                  "Navy",
                  "Olive Green",
                  "Grey",
                  "White",
                  "Charcoal",
                  "Maroon",
                  "Forest Green",
                  "Light Blue",
                  "Mint",
                  "Red",
                  "Cream",
                  "Royal Blue",
                ],
              },
              {
                name: "Size",
                position: 2,
                values: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
              },
            ],
            images: [updateProductImages],
            image: {
              position: 1,
              created_at: "2023-04-10T08:39:55-07:00",
              updated_at: "2023-04-10T08:40:01-07:00",
              alt: "Basic Polo-Black-Front",
              width: 1001,
              height: 1250,
              src: "https://cdn.shopify.com/s/files/1/0182/4159/products/ITAM_Basic_Mens_Polo_Black.jpg?v=1681141201",
            },
          },
        };
        const response = await client.put(`/products/${productId}`, {
          data: body,
        });

        if (response.ok) {
          console.log(`Product ${productId} updated successfully.`);
        } else {
          console.error(
            `Failed to update product ${productId}: `,
            response.statusText
          );
        }
      }
    }

    // Deleting 3500 records
    for (const productId of insertedRecordIds) {
      const response = await client.delete(`/products/${productId}`);
      if (response.ok) {
        console.log(`Product ${productId} deleted successfully.`);
      } else {
        console.error(
          `Failed to delete product ${productId}: `,
          response.statusText
        );
      }
    }

    console.log("All operations completed successfully.");
  } catch (error) {
    console.error("Error during operation:", error);
  }
}

// Uncomment below code when we have to CREATE, UPDATE and DELETE the same inserted recods in bunch.
// // Call the function
// manipulate10kProducts();

async function manipulate50kProducts() {
  try {
    // Inserting 10000 records
    const numberOfInserts = 10000;
    const insertedRecordIds = [];

    for (let i = 1; i <= numberOfInserts; i++) {
      const body = {
        product: {
          title: `Cycle ${i} `,
        },
      };
      const response = await client.post("/products", { data: body });

      if (response.ok) {
        const responseBody = await response.json();
        console.log(
          `Product ${i} inserted successfully. ID: ${responseBody.product.id}`
        );
        insertedRecordIds.push(responseBody.product.id);
      } else {
        console.error(`Failed to insert product ${i}: `, response.statusText);
      }
    }

    // Updating 30000 records
    const numberOfProducts = 30000;
    for (let i = 1; i <= numberOfProducts; i++) {
      const body = {
        product: {
          title: `Bike ${i}`,
        },
      };
      const response = await client.put(`/products/7680580649157`, {
        data: body,
      });

      if (response.ok) {
        const responseBody = await response.json();
        console.log(
          `Product ${i} updated successfully. ID: ${responseBody.product.id} `
        );
      } else {
        console.error(`Failed to update product ${i}: `, response.statusText);
      }
    }

    // Deleting 10000 records
    for (const productId of insertedRecordIds) {
      const response = await client.delete(`/products/${productId}`);
      if (response.ok) {
        console.log(`Product ${productId} deleted successfully.`);
      } else {
        console.error(
          `Failed to delete product ${productId}: `,
          response.statusText
        );
      }
    }

    console.log("All operations completed successfully.");
  } catch (error) {
    console.error("Error during operation:", error);
  }
}

// Uncomment below code when we have to CREATE 10k, UPDATE 30k and DELETE 10k recods in bunch.
// // Call the function
// manipulate50kProducts();

// Uncomment below code when we have to generate csv file for diffrent products (To testing using JMeter)
/* 
    // Function to generate CSV content
    const generateCSVContent = (count) => {
        let csvContent = 'title\n';
        for (let i = 1; i <= count; i++) {
            csvContent += `"Watch ${i}"\n`;
        }
        return csvContent;
    };
    
    // Function to write CSV content to a file
    const writeCSVToFile = (content, filename) => {
        fs.writeFile(filename, content, (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
            } else {
                console.log(`CSV file "${filename}" has been created successfully.`);
            }
        });
    };
    
    // Number of titles
    const numberOfTitles = 50000;
    
    // Generate CSV content
    const csvContent = generateCSVContent(numberOfTitles);
    
    // Write CSV content to file
    writeCSVToFile(csvContent, '50k-Titles.csv');
    console.log(`Wrote ${numberOfTitles} Titles Successfully into CSV File.`); 
*/

app.listen(port, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + port
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});

const client = require("./client");

const {} = require("./index");

async function dropTables() {
  try {
    console.log("Dropping all Tables");
    await client.query(`
        DROP TABLE IF EXISTS building_compilation;
        DROP TABLE IF EXISTS building_image;   
        DROP TABLE IF EXISTS building;
        `);
    console.log("Finished dropping Tables");
  } catch (error) {
    console.error("Error dropping Tables...");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build Tables");

    await client.query(`
        CREATE TABLE building (
            id SERIAL PRIMARY KEY,
            project_name VARCHAR(255) NOT NULL,
            description VARCHAR(2000) NOT NULL,
            role VARCHAR(2000) NOT NULL
        );

        CREATE TABLE building_image (
            id SERIAL PRIMARY KEY,
            image_url VARCHAR(2000)
        );

        CREATE TABLE building_compilation (
            id SERIAL PRIMARY KEY,
            building_id INTEGER REFERENCES building(id) NOT NULL,
            building_image_id INTEGER REFERENCES building_image(id) NOT NULL,
            UNIQUE (building_id, building_image_id)
        )
    `);
    console.log("Finished building Tables");
  } catch (error) {
    console.error("Error dropping Tables...");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    // console.log("Executing rebuildDB");
    await dropTables();
    await createTables();
    // console.log("Completed rebuildDB");
  } catch (error) {
    console.log("Error during rebuildDB...");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Executing testDB");
    console.log("Completed testDB");
  } catch (error) {
    console.log("Error during testDB...");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

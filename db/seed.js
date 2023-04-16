const client = require("./client");

const { createBuilding, createBuildingImage } = require("./index");

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
            building_name VARCHAR(255) NOT NULL,
            description VARCHAR(2000) NOT NULL,
            role VARCHAR(2000) NOT NULL
        );

        CREATE TABLE building_image (
            id SERIAL PRIMARY KEY,
            image_url VARCHAR(2000),
            description VARCHAR(2000)
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

async function createInitialBuildings() {
  try {
    console.log("Starting to create buildings");
    const montage = await createBuilding({
      building_name: "The Montage",
      description:
        "The Montage is the newest and (in my opinion) most iconic building in Cebu City, Philippines. It is a sustainable multi-function building with commercial spaces at the podium and offices in the tower.",
      role: "Drafting the proposal for the LEED certification for the high-rise office. The structure was eventually pre-certified in the Silver category.",
    });
    // console.log(montage, "this is montage");

    const astrip = await createBuilding({
      building_name: "ASTRIP Commercial Center",
      description:
        "ASTRIP was originally meant to be a mid-rise dormitory for students with a commercial podium.",
      role: "Provided all construction documentation for the building. Coordinated with the contract manufacturer with regards to the megatext signage and other steel works.",
    });
    // console.log(astrip, "this is astrip");

    const tambuli = await createBuilding({
      building_name: "Tambuli Seaside Resort and Spa",
      description: "Insert Tambuli description here.",
      role: "Tambuli has multiple structures. I was involved in the Spa, Seaside Restaurant, Tower A & C Penthouse Suites, and Clubhouse drawings.",
    });
    // console.log(tambuli, "this is tambuli");

    console.log("Finished to creating buildings");
  } catch (error) {
    console.error("Error creating buildings...");
    throw error;
  }
}

async function createInitialBuildingImage() {
  try {
    console.log("Starting to create building images");

    const montage_image = await createBuildingImage({
      image_url:
        "https://scontent-atl3-2.xx.fbcdn.net/v/t39.30808-6/242355779_10165875795415473_638974461281986568_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=gohcDHz9454AX_rOWpf&_nc_ht=scontent-atl3-2.xx&oh=00_AfDnqua_0xNJzeRQC_IXmXS4rZHX0OeIgNnDwABnPDJzpA&oe=643E0447",
      description: "The Montage as seen from the south side.",
    });
    // console.log(montage_image, "this is montage_image");

    console.log("Finished to creating building images");
  } catch (error) {
    console.error("Error creating building images...");

    throw error;
  }
}
async function rebuildDB() {
  try {
    client.connect();
    console.log("Executing rebuildDB");
    await dropTables();
    await createTables();
    await createInitialBuildings();
    await createInitialBuildingImage();

    console.log("Completed rebuildDB");
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

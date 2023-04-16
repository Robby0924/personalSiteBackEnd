const client = require("./client");

const {
  createUser,
  updateUser,
  createBuilding,
  createBuildingImage,
  deleteBuildingImage,
  addBuildingImageToBuilding,
  getBuildingCompilationById,
  getAllBuildings,
  getBuildingByBuildingId,
} = require("./index");

async function dropTables() {
  try {
    console.log("Dropping all Tables");
    await client.query(`
        DROP TABLE IF EXISTS building_compilation;
        DROP TABLE IF EXISTS building;
        DROP TABLE IF EXISTS building_image;  
        DROP TABLE IF EXISTS users;   
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

        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE building_image (
            id SERIAL PRIMARY KEY,
            image_url VARCHAR(2000),
            description VARCHAR(2000)
        );

        CREATE TABLE building (
            id SERIAL PRIMARY KEY,
            building_name VARCHAR(255) NOT NULL,
            description VARCHAR(2000) NOT NULL,
            role VARCHAR(2000) NOT NULL
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

async function createInitialUser() {
  try {
    console.log("Starting to create users");

    const robby = await createUser({
      first_name: "Robby",
      last_name: "Bacus",
      password: "admin",
      email: "robbybacus@gmail.com",
    });
    console.log(robby, "this is robby");

    console.log("Finished creating building users");
  } catch (error) {
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

    console.log("Finished creating buildings");
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

    const montage_image_2 = await createBuildingImage({
      image_url:
        "https://scontent-atl3-1.xx.fbcdn.net/v/t39.30808-6/240586894_10165875795410473_7685780983242654726_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=730e14&_nc_ohc=vQwk0fJo6NkAX-yHD7H&_nc_ht=scontent-atl3-1.xx&oh=00_AfAftnU7tm6MDKgj2zXPUW0dvy1KagajIQ83Z-qF22Dl1Q&oe=6440BFD8",
      description: "The Montage as seen from Archbishop Reyes Ave.",
    });
    //   console.log(montage_image_2, "this is montage_image_2");

    const astrip_image = await createBuildingImage({
      image_url:
        "https://scontent-atl3-2.xx.fbcdn.net/v/t1.6435-9/151326381_231514668647572_4041781631446339514_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=730e14&_nc_ohc=K9gVAUcaRjUAX9E2R8o&_nc_ht=scontent-atl3-2.xx&oh=00_AfA1Tw4haJTYu8cMlbiMfqSlebSXLMcwMAYyJGwZUjj-5w&oe=646072BC",
      description: "AStrip post construction. Ready for lease!",
    });
    //   console.log(astrip_image, "this is astrip_image");

    console.log("Finished creating building images");
  } catch (error) {
    console.error("Error creating building images...");
    throw error;
  }
}

async function createInitialBuildingImageToBuilding() {
  try {
    console.log("Starting to merge building image to building");

    const montageImageToMontageBuilding = await addBuildingImageToBuilding({
      building_id: 1,
      building_image_id: 1,
    });
    // console.log(
    //   montageImageToMontageBuilding,
    //   "this is montageImageToMontageBuilding"
    // );

    const montageImageToMontageBuilding_2 = await addBuildingImageToBuilding({
      building_id: 1,
      building_image_id: 2,
    });
    // console.log(
    //   montageImageToMontageBuilding_2,
    //   "this is montageImageToMontageBuilding_2"
    // );

    const astripImageToAstripBuilding = await addBuildingImageToBuilding({
      building_id: 2,
      building_image_id: 3,
    });
    // console.log(
    //   montageImageToMontageBuilding_2,
    //   "this is montageImageToMontageBuilding_2"
    // );

    console.log("Finished merging building image to building");
  } catch (error) {
    console.error("Error merging building image to building...");

    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    console.log("Executing rebuildDB");
    await dropTables();
    await createTables();
    await createInitialUser();
    await createInitialBuildings();
    await createInitialBuildingImage();
    await createInitialBuildingImageToBuilding();

    console.log("Completed rebuildDB");
  } catch (error) {
    console.log("Error during rebuildDB...");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Executing testDB");

    //USER TESTS---------------------------------------------------
    // console.log("Calling updateUser");
    // const updatedUser = await updateUser(1, {
    //   first_name: "Jessica",
    //   last_name: "Jung",
    //   email: "jessicajung@gmail.com",
    // });
    // console.log(updatedUser, "this is updateUser");

    //BUILDING IMAGE TESTS---------------------------------------------------
    // console.log("Calling deleteBuildingImage");
    // const deletedBuildingImage = await deleteBuildingImage(2);
    // console.log(
    //   "Result deletedBuildingImage should be undefined",
    //   deletedBuildingImage
    // );

    //BUILDING_COMPILATION TESTS---------------------------------------------------
    console.log("Calling getBuildingCompilationById");
    const montage1 = await getBuildingCompilationById(1);
    console.log(montage1, "this is getBuildingCompilationById");

    console.log("Calling getAllBuildings");
    const allBuildings = await getAllBuildings();
    console.log(allBuildings, "this is getAllBuildings");

    console.log("Calling getBuildingByBuildingId");
    const montage = await getBuildingByBuildingId(1);
    console.log(montage, "this is getBuildingByBuildingId");

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

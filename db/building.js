const client = require("./client");

//-----------------SHOULD BE GOOD-----------------
async function addBuildingImageToBuilding({ building_id, building_image_id }) {
  try {
    const {
      rows: [singleImageToBuilding],
    } = await client.query(
      `
    INSERT INTO building_compilation(building_id, building_image_id)
    VALUES ($1, $2)
    ON CONFLICT (building_id, building_image_id) DO NOTHING
    RETURNING *;
    `,
      [building_id, building_image_id]
    );
    return singleImageToBuilding;
  } catch (error) {
    throw error;
  }
}

async function createBuilding({ building_name, description, role }) {
  try {
    const {
      rows: [building],
    } = await client.query(
      `
        INSERT INTO building (building_name, description, role)
        VALUES($1, $2, $3)
        RETURNING *;
        `,
      [building_name, description, role]
    );
    return building;
  } catch (error) {
    throw error;
  }
}

//-----------------QUESTIONABLE-----------------
async function attachAllImagesToBuilding(buildings) {
  const buildingsToReturn = [...buildings];
  const binds = buildings.map((_, index) => `$${index + 1}`).join(", ");
  const buildingIds = buildings.map((building) => building.id);
  if (!buildingIds?.length) return [];

  try {
    const { rows: building_image } = await client.query(
      `
    SELECT building_image.*, building_compilation.id AS "buildingCompilationId", building_compilation.building_id
    FROM building_image
    JOIN building_compilation ON building_compilation.building_image_id = building_image.id
    WHERE building_compilation.building_id IN (${binds});
    `,
      buildingIds
    );

    for (const building of buildingsToReturn) {
      const buildingImagesToAdd = building_image.filter(
        (building_image) => building_image.building_id === building.id
      );
      building.building_image = buildingImagesToAdd;
    }
    return buildingsToReturn;
  } catch (error) {
    throw error;
  }
}

//-----------------ALMOST THERE-----------------
async function getAllBuildings() {
  try {
    const { rows } = await client.query(`
  SELECT *
  FROM building_compilation
  `);
    const buildings = await attachAllImagesToBuilding(rows);
    return buildings;
  } catch (error) {
    throw error;
  }
}

async function getBuildingByBuildingId(buildingId) {
  try {
    const {
      rows: [building],
    } = await client.query(`
    SELECT *
    FROM building`);
    return building;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addBuildingImageToBuilding,
  createBuilding,
  getAllBuildings,
  getBuildingByBuildingId,
};

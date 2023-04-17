const client = require("./client");

//-----------------WORKING-----------------
async function addBuildingImageToBuilding({ building_id, building_image_id }) {
  try {
    const {
      rows: [singleImageToBuilding],
    } = await client.query(
      `
    INSERT INTO bldg_bldgImg(building_id, building_image_id)
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
        ON CONFLICT (building_name) DO NOTHING
        RETURNING *;
        `,
      [building_name, description, role]
    );
    return building;
  } catch (error) {
    throw error;
  }
}

async function deleteBuilding(building_id) {
  try {
    await client.query(`
    DELETE
    FROM bldg_bldgImg
    WHERE building_id=${building_id}
    RETURNING *`);

    await client.query(`
    DELETE
    FROM building
    WHERE id=${building_id}
    RETURNING *`);
  } catch (error) {
    throw error;
  }
}

async function getAllBuildings() {
  try {
    const { rows } = await client.query(`
  SELECT *
  FROM building
  `);
    const buildings = await attachAllImagesToBuilding(rows);
    return buildings;
  } catch (error) {
    throw error;
  }
}

async function getBuildingByBuildingId(building_id) {
  try {
    const { rows } = await client.query(
      `
    SELECT *
    FROM building
    WHERE id=$1
    `,
      [building_id]
    );

    const buildingInfo = await attachAllImagesToBuilding(rows);
    return buildingInfo;
  } catch (error) {
    throw error;
  }
}

async function getBuildingByName(building_name) {
  try {
    const {
      rows: [building],
    } = await client.query(
      `
    SELECT *
    FROM building
    WHERE building_name=$1
    `,
      [building_name]
    );
    return building;
  } catch (error) {
    throw error;
  }
}

async function updateBuilding(building_id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [building],
    } = await client.query(
      `
    UPDATE building
    SET ${setString}
    WHERE id=${building_id}  
    RETURNING *
    `,
      Object.values(fields)
    );

    return building;
  } catch (error) {
    throw error;
  }
}

//-----------------I GUESS ITS'S WORKING?-----------------
async function attachAllImagesToBuilding(buildings) {
  const buildingsToReturn = [...buildings];
  const binds = buildings.map((_, index) => `$${index + 1}`).join(", ");
  const buildingIds = buildings.map((building) => building.id);
  if (!buildingIds?.length) return [];

  try {
    const { rows: building_image } = await client.query(
      `
    SELECT building_image.*, bldg_bldgImg.id AS "bldg_bldgImgId", bldg_bldgImg.building_id
    FROM building_image
    JOIN bldg_bldgImg ON bldg_bldgImg.building_image_id = building_image.id
    WHERE bldg_bldgImg.building_id IN (${binds});
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

module.exports = {
  addBuildingImageToBuilding,
  createBuilding,
  deleteBuilding,
  getAllBuildings,
  getBuildingByBuildingId,
  getBuildingByName,
  updateBuilding,
};

const client = require("./client");

//-----------------SHOULD BE GOOD-----------------
async function delete_Bldg_BldgImg_ById(bldg_bldgImg_Id) {
  try {
    const {
      rows: [bldg_bldgImg],
    } = await client.query(
      `
        DELETE
        FROM bldg_bldgImg
        WHERE id=$1
        RETURNING *`,
      [bldg_bldgImg_Id]
    );
    return bldg_bldgImg;
  } catch (error) {
    throw error;
  }
}

async function get_All_Bldg_Bldg_Img() {
  try {
    const { rows } = await client.query(`
  SELECT *
  FROM bldg_bldgImg
  `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function get_Bldg_BldgImg_ById(bldg_bldgImg_Id) {
  try {
    const {
      rows: [bldg_bldgImg],
    } = await client.query(
      `
        SELECT *
        FROM bldg_bldgImg
        WHERE id = $1`,
      [bldg_bldgImg_Id]
    );
    return bldg_bldgImg;
  } catch (error) {
    throw error;
  }
}

async function get_Bldg_BldgImg_By_BldgId(building_id) {
  try {
    const {
      rows,
    } = await client.query(
      `
        SELECT *
        FROM bldg_bldgImg
        WHERE building_id = $1`,
      [building_id]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

//-----------------THIS NEEDS TO BE IN BOTH BUILDING.JS AND BLDG_BLDGIMG.JS-----------------
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
  delete_Bldg_BldgImg_ById,
  get_All_Bldg_Bldg_Img,
  get_Bldg_BldgImg_ById,
  get_Bldg_BldgImg_By_BldgId,
};

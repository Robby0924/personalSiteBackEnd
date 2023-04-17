const client = require("./client");

async function createBuildingImage({ image_url, description }) {
  try {
    const {
      rows: [building_image],
    } = await client.query(
      `
        INSERT INTO building_image (image_url, description)
        VALUES($1, $2)
        RETURNING *;
        `,
      [image_url, description]
    );
    return building_image;
  } catch (error) {
    throw error;
  }
}

async function deleteBuildingImage(buildingImage_id) {
  try {
    await client.query(`
    DELETE
    FROM bldg_bldgImg
    WHERE building_image_id=${buildingImage_id}
    RETURNING *`);

    await client.query(`
    DELETE
    FROM building_image
    WHERE id=${buildingImage_id}
    RETURNING *`);
  } catch (error) {
    throw error;
  }
}

async function getAllBuildingImages() {
  try {
    const { rows } = await client.query(`
  SELECT *
  FROM building_image
  `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getBuildingImageByBuildingImageId(buildingImage_id) {
  try {
    const {
      rows: [building_image],
    } = await client.query(
      `
    SELECT *
    FROM building_image
    WHERE id=$1
    `,
      [buildingImage_id]
    );

    return building_image;
  } catch (error) {
    throw error;
  }
}

async function updateBuildingImage(buildingImage_id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [buildingImage],
    } = await client.query(
      `
    UPDATE building_image
    SET ${setString}
    WHERE id=${buildingImage_id}  
    RETURNING *
    `,
      Object.values(fields)
    );

    return buildingImage;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createBuildingImage,
  deleteBuildingImage,
  getAllBuildingImages,
  getBuildingImageByBuildingImageId,
  updateBuildingImage,
};

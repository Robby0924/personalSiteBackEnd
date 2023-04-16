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

module.exports = {
  createBuildingImage,
};

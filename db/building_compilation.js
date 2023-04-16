const client = require("./client");

//-----------------QUESTIONABLE-----------------
async function attachImagesToBuilding(buildings) {
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

//-----------------SHOULD BE GOOD-----------------
async function getBuildingCompilationById(buildingCompilationId) {
  try {
    const {
      rows: [building_compilation],
    } = await client.query(
      `
        SELECT *
        FROM building_compilation
        WHERE id = $1`,
      [buildingCompilationId]
    );
    return building_compilation;
  } catch (error) {
    throw error;
  }
}

async function deleteBuildingCompilation(buildingCompilationId) {
  try {
    const {
      rows: [building_compilation],
    } = await client.query(
      `
        DELETE
        FROM building_compilation
        WHERE id=$1
        RETURNING *`,
      [buildingCompilationId]
    );
    return building_compilation;
  } catch (error) {
    throw error;
  }
}

module.exports = { deleteBuildingCompilation, getBuildingCompilationById };

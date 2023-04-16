const client = require("./client");



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

//-----------------NOT WORKING AS INTENDED-----------------

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

module.exports = {
  deleteBuildingCompilation,
  getBuildingCompilationById,
};

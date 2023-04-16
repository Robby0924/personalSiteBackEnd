const client = require("./client");

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

module.exports = {
  createBuilding,
};

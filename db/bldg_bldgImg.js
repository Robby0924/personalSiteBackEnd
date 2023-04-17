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

module.exports = {
  delete_Bldg_BldgImg_ById,
  get_All_Bldg_Bldg_Img,
  get_Bldg_BldgImg_ById,
};

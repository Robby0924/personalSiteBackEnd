const client = require("./client");



//-----------------SHOULD BE GOOD-----------------
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

//-----------------NOT WORKING AS INTENDED-----------------

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

module.exports = {
  delete_Bldg_BldgImg_ById,
  get_Bldg_BldgImg_ById,
};

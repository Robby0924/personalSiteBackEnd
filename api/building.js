const express = require("express");
const buildingRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getAllBuildings,
  createBuilding,
  getBuildingByName,
  getBuildingByBuildingId,
  get_Bldg_BldgImg_By_BldgId,
  addBuildingImageToBuilding,
  deleteBuilding,
  updateBuilding,
} = require("../db");

//POST A BUILDING : WORKING
//POST /api/building/-----------------------------------------------------
buildingRouter.post("/buildings", async (req, res, next) => {
  let { building_name, description, role } = req.body;

  try {
    const existingBuilding = await getBuildingByName(building_name);

    if (existingBuilding) {
      res.status(409);
      return next({
        name: "BuildingExistsError",
        message: `Building "${building_name}" already exists.`,
        error: "BuildingExistsError",
      });
    }

    const building = await createBuilding({
      building_name,
      description,
      role,
    });

    res.send({ message: `${building_name} successfully posted!`, building });
  } catch (error) {
    throw error;
  }
});

//GET ALL BUILDINGS : WORKING
//GET /api/building/-----------------------------------------------------
buildingRouter.get("/buildings", async (req, res, next) => {
  try {
    const allBuildings = await getAllBuildings();

    if (allBuildings) {
      res.send(allBuildings);
    } else {
      res.status(400);
      return next({
        name: "AllBuildingsError",
        message: "Error fetching all buildings",
        error: "AllBuildingsError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//ATTACH BUILDING IMAGE TO BUILDING : WORKING
//POST /api/building/-----------------------------------------------------
buildingRouter.post("/buildings/:building_id", async (req, res, next) => {
  const { building_id } = req.params;
  const { building_image_id } = req.body;

  const buildingImgArray = await get_Bldg_BldgImg_By_BldgId(building_id);
  let exists = false;

  buildingImgArray.forEach((bldg_bldgImg) => {
    if (bldg_bldgImg.building_image_id === building_image_id) {
      exists = true;
    }
  });

  if (exists) {
    res.status(409);
    return next({
      name: "BldgImgAttachedToBldgError",
      message: `Building Image ${building_image_id} is already attached to Building ${building_id}.`,
      error: "BldgImgAttachedToBldgError",
    });
  } else {
    await addBuildingImageToBuilding({
      building_id,
      building_image_id,
    });

    let building = await getBuildingByBuildingId(building_id);
    res.send({
      message: `Image ${building_image_id} successfully attached!`,
      building,
    });
  }
});

//DELETE BUILDING : WORKING
//DELETE /api/building/-----------------------------------------------------
buildingRouter.delete("/buildings/:building_id", async (req, res, next) => {
  const { building_id } = req.params;
  try {
    const building = await getBuildingByBuildingId(building_id);
    if (building.length >= 1) {
      await deleteBuilding(building_id);
      const _building = await getBuildingByBuildingId(building_id);

      if (_building.length < 1) {
        res.send({ message: `Building ${building_id} was deleted.` });
      } else {
        res.status(400);
        return next({
          name: "BuildingFailedToDeleteError",
          message: `Failed to delete building.`,
          error: "BuildingFailedToDeleteError",
        });
      }
    } else {
      res.status(400);
      return next({
        name: "BuildingNotFoundError",
        message: `Building not found.`,
        error: "BuildingNotFoundError",
      });
    }
  } catch (error) {
    throw error;
  }
});

//UPDATE BUILDING : NOT WORKING
//PATCH /api/building/-----------------------------------------------------
buildingRouter.patch("/buildings/:building_id", async (req, res, next) => {
  const { building_id } = req.params;
  const { building_name, description, role } = req.body;

  try {
    const building = await getBuildingByBuildingId(building_id);
    if (building.length < 1) {
      res.status(400);
      next({
        name: "BuildingNotFoundError",
        message: `Building ${building_id} not found.`,
        error: "BuildingNotFoundError",
      });
    }

    let allBuildings = await getAllBuildings();

    let filteredBuildings = allBuildings.filter(
      (singleBuilding) => singleBuilding.building_name !== building[0].building_name
    );

    filteredBuildings.filter((singleBuilding) => {
      if (singleBuilding.building_name === building_name) {
        res.status(409);
        next({
          name: "BuildingExistsError",
          message: `Building ${building_name} already exists.`,
          error: "BuildingExistsError",
        });
      }
    });

    const updateFields = {};
    updateFields.building_name = building_name;
    updateFields.description = description;
    updateFields.role = role;

    const updatedBuilding = await updateBuilding(building_id, updateFields);
    res.send({
      message: `Building ${building_name} successfully updated!`,
      updatedBuilding,
    });
  } catch (error) {
    throw error;
  }
});
module.exports = buildingRouter;

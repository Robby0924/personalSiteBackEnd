const express = require("express");
const { getAllBuildings } = require("../db");
const buildingRouter = express.Router();
const { requireUser } = require("./utils");
const { createBuilding, getBuildingByName } = require("../db");

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

module.exports = buildingRouter;

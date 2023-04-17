const express = require("express")
const {} = require("../db")
const buildingRouter = express.Router();
const {requireUser} = require("./utils")

module.exports = buildingRouter;

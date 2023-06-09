const { PORT = 3000 } = process.env;
const express = require("express");
const server = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const client = require("./db/client");
client.connect();

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());
server.use((req, res, next) => {
  console.log("Body Logger Start-------");
  console.log(req.body);
  console.log("Body Logger End-------");
  next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);

server.listen(PORT, () => {
  console.log("This server is up on port", PORT);
});

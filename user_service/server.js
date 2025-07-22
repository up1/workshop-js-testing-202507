const express = require('express');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const { router } = require('./users_router');

const server = express();
server.use(express.json()); // Middleware to parse JSON bodies
server.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
server.use(cors());

server.use(router);

var options = {
  explorer: true
};
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

module.exports = {
  server
};

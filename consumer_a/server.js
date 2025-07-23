const express = require("express");
const axios = require("axios");

const server = express();
server.use(express.json());

var getApiEndpoint = () => process.env.USER_API_HOST || "http://localhost:8081";
const authHeader = {
  Authorization: "Bearer token",
};

async function register(userData, authorization) {
  // Prepare auth header
  const requestAuthHeader = {
    Authorization: authorization,
  };

  // Call the user service to register a new user
  try {
    const response = await axios.post(`${getApiEndpoint()}/users`, userData, {
      headers: requestAuthHeader,
    });

    // Return the formatted result
    const result = {
      header: {
        status: "success",
        message: "User registered successfully",
      },
      data: response.data,
    };
    return result;
  } catch (error) {
    throw new Error(
      `Failed to register a new user. Status: ${error.response.status} and message: ${error.response.statusText}`
    );
  }
}

server.post("/api/register", async (req, res) => {
  try {
    // Get data from header
    const { headers } = req;
    if (
      !headers.authorization ||
      headers.authorization !== authHeader.Authorization
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Call the register function
    const result = await register(req.body, headers.authorization);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  server,
  register,
};

const express = require('express');
const axios = require('axios');

const server = express();
server.use(express.json());

const getApiEndpoint = () => process.env.USER_API_HOST || 'http://localhost:8081';
const authHeader = {
  Authorization: 'Bearer token',
};

server.post('/api/register', async (req, res) => {
  try {
    // Get data from header
    const { headers } = req;
    if (!headers.authorization || headers.authorization !== authHeader.Authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    authHeader.Authorization = headers.authorization;

    // Call the user service to register a new user
    const response = await axios.post(`${getApiEndpoint()}/users`, req.body, { headers: authHeader });
    
    // Check if the response status is 201 Created
    if (response.status !== 201) {
      return res.status(response.status).json({ error: 'Failed to register a new user' });
    }
    // Assuming the response contains the created user data
    const result = {
        "header": {
            "status": "success",
            "message": "User registered successfully"
        },
        "data": response.data
    }
    res.status(response.status).json(result);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { server };
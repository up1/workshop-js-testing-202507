const express = require('express');
const UserRepository = require('./repository');

const router = express.Router();

// Import initial data into the user repository
const userRepository = new UserRepository();
const data = require('./data/users.json');
  data.forEach((v) => {
    userRepository.insert(v);
  });



// Middleware for authentication
router.use((req, res, next) => {
  // Check for the Authorization header for /users endpoint
  if (req.path !== '/users') {
    return next();
  }

  const token = req.headers['authorization'] || '';

  if (token !== 'Bearer token') {
    res.sendStatus(401).send();
  } else {
    next();
  }
});

router.get('/users', (req, res) => {
  const users = userRepository.fetchAll();
  res.json(users);
});

router.post('/users', (req, res) => {
  const newUser = req.body;

  // Basic validation
  if (!newUser.name || !newUser.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  userRepository.insert(newUser);
  res.status(201).json(newUser);
});

module.exports = {
  router
};

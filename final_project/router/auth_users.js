const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = [];

// Utility to check if username is valid (not empty and not just spaces)
const isValid = (username) => {
  return username && username.trim().length > 0;
};

// Check if user credentials are valid
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Check if user already exists
const doesExist = (username) => {
  return users.some(user => user.username === username);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "User successfully logged in." });
});

// User registration (moved from general.js for clarity)
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered." });
});

// Placeholder for book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;

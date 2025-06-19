const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const authenticatedUser = require('./router/auth_users.js').authenticatedUser;

const app = express();
const PORT = 5000;

app.use(express.json());

// Use session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Middleware to check authentication for protected customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        return next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Public and protected routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const express = require("express");
const router = express.Router();

router.post("/login", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

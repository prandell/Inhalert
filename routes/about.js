var express = require("express");
var router = express.Router();

// Dashboard
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

//Welcome Page
router.get("/", forwardAuthenticated, (req, res) => {
  res.render("about");
});

module.exports = router;

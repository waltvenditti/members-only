var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Members Only" });
});

// GET signup page
router.get("/signup", userController.user_signup_get);

// POST signup page
router.post("/signup", userController.user_signup_post);

module.exports = router;

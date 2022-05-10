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

// GET become member page
router.get("/joinclub", userController.join_club_get);

// POST become member page
router.post("/joinclub", userController.join_club_post);

// GET members landing page
router.get("/memberpage", userController.member_landing_get);

// GET signup successful page
router.get("/signupsuccess", userController.signup_success_get);

module.exports = router;

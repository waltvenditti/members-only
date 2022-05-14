var express = require("express");
var passport = require("passport");
const app = require("../app");
var router = express.Router();
var userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Members Only", user: req.user });
});

// GET signup page
router.get("/signup", userController.user_signup_get);

// POST signup page
router.post("/signup", userController.user_signup_post);

// GET login page
router.get("/login", userController.user_login_get);

// POST login page
router.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/signupsuccess",
    failureRedirect: "/loginfail"
  }
));

router.get("/loginfail", (req, res) => {
  res.render("loginfail", { title: "Log In"})
});

router.get("/signupsuccess_and_login", passport.authenticate("local", 
{
  successRedirect: "/signupsuccess",
  failureRedirect: "/loginfail"
}
))

// GET logout 
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

// GET become member page
router.get("/joinclub", userController.join_club_get);

// POST become member page
router.post("/joinclub", userController.join_club_post);

// GET members landing page
router.get("/memberpage", userController.member_landing_get);

// GET signup successful page
router.get("/signupsuccess", userController.signup_success_get);

module.exports = router;

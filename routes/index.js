var express = require("express");
var passport = require("passport");
const app = require("../app");
var router = express.Router();
var userController = require("../controllers/userController");
var messageController = require("../controllers/messageController");

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
    successRedirect: "/loginsuccess",
    failureRedirect: "/loginfail"
  }
));

// GET loginfail page
router.get("/loginfail", (req, res) => {
  res.render("loginfail", { title: "Log In"})
});

// GET logout 
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

// GET become member page
router.get("/joinclub", userController.join_club_get);

// POST become member page
router.post("/joinclub", userController.join_club_post);

// GET login successful page
router.get("/loginsuccess", userController.login_success_get);

// GET chat page
router.get("/chat", messageController.chat_get);

// GET new message page
router.get("/newmessage", messageController.new_msg_get);

module.exports = router;

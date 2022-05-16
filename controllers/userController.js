var User = require("../models/user");
var Message = require("../models/message");
const { body,validationResult } = require("express-validator"); 
const bcrypt = require("bcryptjs/dist/bcrypt");
const passport = require("passport");
const PASSCODE = "a broken smile beneath her whispered wings"
const ADMIN_PASSCODE = "i will see you in time"

// Display the user signup page
exports.user_signup_get = function(req, res) {
  res.render("signup", {
    title: "Sign Up",
  })
}

exports.user_signup_post = [
  // validate and sanitize
  body("first_name", "You must enter a first name")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "You must enter a last name")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "You must enter a username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "You must enter a password")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password2", "You must enter your password twice")
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords do not match"),
  // process req following v/s
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors. render form again with sanitized values and error messages
      var resendUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
      });
      res.render("signup", {
        title: "Sign Up",
        resendUser: resendUser,
        errors: errors.array(),
      });
    } else {
      User.findOne({ username: req.body.username }, (dbErr, results) => {
        if (dbErr) {
          return next(dbErr);
        }
        if (results !== null) {
          // username already in use
          let newError = {
            value: "",
            msg: "Username already in use",
            param: "username",
            location: "body",
          };
          var resendUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
          });
          res.render("signup", {
            title: "Sign Up",
            resendUser: resendUser,
            errors: [newError],
          });
        } else {
          // data from form is valid
          // encrypt password
          bcrypt.hash(req.body.password, 10, (err, hashedPW) => {
            if (err) {
              res.send("Error with bcrypt");
            }
            var user = new User({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              password: hashedPW,
              member_status: "user",
            });
            user.save((err) => {
              if (err) {
                return next(err);
              }
              passport.authenticate("local", 
              {
                successRedirect: "/loginsuccess",
                failureRedirect: "/loginfail"
              })(req, res, next);
            });
          });
        }
      });
    }
  },
];

exports.user_login_get = function(req, res) {
  res.render("login", {
    title: "Log In",
  });
}

exports.login_success_get = function(req, res) {
  if (res.locals.currentUser===undefined) {
    res.redirect("/");
  }
  res.render("loginsuccess", {
    title: "Login Successful"
  });
}

exports.join_club_get = function(req, res) {
  res.render("joinclub", {
    title: "Join The Club",
  })
}

exports.join_club_post = [
  // validate and sanitize
  body("passcode", "Enter a passcode").trim().isLength({ min: 1 }).escape(),
  body("username", "Enter a username").trim().isLength({ min: 1 }).escape(),
  // process request following v/s
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors
      res.render("joinclub", {
        title: "Join The Club",
        errors: errors.array(),
      });
    }
    // everything above works. below is where the problem is
    else {
      // data form is valid. check username exists and check passcode is correct
      User.findOne({ username: req.body.username }, (err, results) => {
        if (err) {
          return next(err);
        }
        if (results === null) {
          // username not found
          res.render("joinclub", {
            title: "Join The Club",
            errors: [{ msg: "The specified user does not exist." }],
          });
          return next();
        }
        if (
          req.body.passcode === ADMIN_PASSCODE &&
          results.member_status === "member"
        ) {
          // make member an admin
          var updatedUser = new User({
            _id: results._id,
            first_name: results.first_name,
            last_name: results.last_name,
            username: results.username,
            password: results.password,
            member_status: results.member_status,
            admin: true,
          });
          User.findByIdAndUpdate(results._id, updatedUser, {}, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/memberpage");
          });
        } else if (
          req.body.passcode === PASSCODE &&
          results.member_status === "user"
        ) {
          // upgrade user to member
          var updatedUser = new User({
            _id: results._id,
            first_name: results.first_name,
            last_name: results.last_name,
            username: results.username,
            password: results.password,
            member_status: "member",
          });
          User.findByIdAndUpdate(results._id, updatedUser, {}, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/memberpage");
          });
        } else {
          // passcode is incorrect
          res.render("joinclub", {
            title: "Join The Club",
            errors: [{ msg: "The passcode you entered is invalid." }],
          });
          return next();
        }
      });
    }
  },
];

exports.member_landing_get = function(req, res) {
  res.render("memberpage", {
    title: "Members Club",
  })
}

exports.chat_get = function(req, res) {
  Message.find().sort([["timestamp", "ascending"]]).populate("author").exec((err, messages) => {
    if (err) { return next(err); }
    for (let i = 0; i < messages.length; i++) {
      //messages[i].timestamp = 
    }
    res.render("chat", {
      title: "Chat Log",
      messages: messages
    })
  })
}
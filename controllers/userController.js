var User = require("../models/user");
const { body,validationResult } = require("express-validator"); 

// Display the user signup page
exports.user_signup_get = function(req, res) {
  res.render("signup", {
    title: "Sign Up"
  })
}

// handle user-submitted signup doc
// exports.user_signup_post = function(req, res) {
//   res.send("This POST controller is under construction");
// }

exports.user_signup_post = [
  // validate and sanitize
  body("first_name", "You must enter a first name").trim().isLength({ min: 1 }).escape(),
  body("last_name", "You must enter a last name").trim().isLength({ min: 1 }).escape(),
  body("username", "You must enter a username").trim().isLength({ min: 1 }).escape(),
  body("password", "You must enter a password").trim().isLength({ min: 1 }).escape(),
  // process req following v/s
  (req, res, next) => {
    const errors = validationResult(req);
    var user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      member_status: "user",
    });
    if (!errors.isEmpty()) {
      // there are errors. render form again with sanitized values and error messages
      res.render("signup", {
        title: "Sign Up",
        user: user,
        errors: errors.array(),
      })
    } else {
      // data from form is valid
      user.save((err) => {
        if (err) { return next(err); }
        res.send("User created successfully.");
      });
    }
  }
];
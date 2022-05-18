var createError      = require("http-errors");
var express          = require("express");
var path             = require("path");
var cookieParser     = require("cookie-parser");
var logger           = require("morgan");
var bcrypt           = require("bcryptjs");
var passport         = require("passport");
var session          = require("express-session");
var helmet           = require("helmet");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var User = require("./models/user");

var app = express();

// connect to mongodb
var mongoose = require("mongoose");
var mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middleware for passport local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      })
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// see how deserialize takes the id that was passed to done in the function above, and uses it to find the user in the db
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// middleware for session and passport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// middleware to access current user everywhere
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

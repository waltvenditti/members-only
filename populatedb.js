var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith("mongodb")) {
  console.log("ERROR: You need to specify a valid mongodb URL as the first argument");
}

var async = require("async");
var User = require("./models/user");
var Message = require("./models/message");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var users = [];
var messages = [];

function userCreate(first_name, last_name, username, password, member_status, admin, cb) {
  userdetail = {
    first_name: first_name,
    last_name: last_name,
    username: username,
    password: password,
    member_status: member_status,
  };
  if (admin) userdetail.admin = true;

  var user = new User(userdetail);
  user.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New User: " + user);
    users.push(user);
    cb(null, user);
  });
}

function messageCreate(author, title, text, timestamp, cb) {
  messagedetail = {
    author: author,
    title: title,
    text: text,
    timestamp: timestamp,
  };

  var message = new Message(messagedetail);
  message.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Message:" + message);
    messages.push(message);
    cb(null, message);
  });
}

function createUsers(cb) {
  async.series(
    [
      function(callback) {
        userCreate("Marshall", "Kingston", "theADMIN", "password123", "member", true, callback);
      },
      function(callback) {
        userCreate("John", "Doe", "jd123", "gOatS123", "user", false, callback);
      },
      function(callback) {
        userCreate("Jake", "Johnson", "bLUEpRINT", "pwpwpw", "member", false, callback);
      },
    ],
    cb
  );
}

function createMessages(cb) {
  let date1 = new Date("June 15, 2022 14:00:00");
  let date2 = new Date("June 15, 2019 14:05:10");
  async.parallel(
    [
      function(callback) {
        messageCreate(users[0], "IMPORTANT ANNOUNCEMENT", "Summer has finally started. Get outside and get some sun.", date1, callback);
      },
      function(callback) {
        messageCreate(users[2], "re:IMPORTANT ANNOUNCEMENT", "I live in Australia. It's winter right now...", date2, callback);
      },
    ],
    cb
  )
}

async.series(
  [
    createUsers,
    createMessages,
  ],
  (err, results) => {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    } else {
      console.log("MESSAGES: " + messages)
    }
    mongoose.connection.close();
  }
)
var Message = require("../models/message");
const { body,validationResult } = require("express-validator"); 
const { format } = require("date-fns");

// GET new message page
exports.new_msg_get = function(req, res) {
  if (res.locals.currentUser===undefined) {
    res.redirect("/login");
  }
  else if (res.locals.currentUser.member_status==="user") {
    res.redirect("/joinclub");
  }
  else {
    res.render("newmessage", {
      title: "New Message"
    });
  }
}

// POST new message (adds msg to db)
exports.new_msg_post = [
  // validate and sanitize
  body("title", "Invalid title.").optional({ checkFalsy: true }).trim().escape(),
  body("text", "Enter a message.").trim().isLength({ min: 1 }).escape(),
  // middleware for handling request after val/san
  (req, res, next) => {
    // check validationResult
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors
      res.render("newmessage", {
        title: "New Message",
        msg_title: (req.body.title===undefined ? "" : req.body.title),
        msg_text: req.body.text,
        errors: errors.array()
      })
    } else {
      // data is valid. create a new message, save it to the tb, and redirect to chatlog
      var newMessage = new Message({

        author: res.locals.currentUser,
        title: (req.body.title===undefined ? "" : req.body.title),
        text: req.body.text,
        timestamp: new Date()
      });
      newMessage.save((err) => {
        if (err) { return next(err); }
        res.redirect("/chat");
      })
    }
  }
]


// GET chat log 
exports.chat_get = function(req, res) {
  Message.find().sort([["timestamp", "descending"]]).populate("author").exec((err, messages) => {
    if (err) { return next(err); }
    let newMessages = [];
    for (let i = 0; i < messages.length; i++) {
      let newMessage = { ...messages[i]._doc };
      let date = messages[i].timestamp;
      newMessage.timestamp = format(date, "d MMM yyyy, h:mm:ss bb");
      newMessages.push(newMessage);
    }
    res.render("chat", {
      title: "Chat Log",
      messages: newMessages
    })
  })
}

// POST chat log (for deleting specific msgs)
exports.chat_post = function(req, res) {
  Message.findByIdAndRemove(req.body.msg_id, (err) => {
    if (err) { return next(err); }
    res.redirect("/chat");
  })
  // find the message
  // if err, return err
  // redirect to chat page
}
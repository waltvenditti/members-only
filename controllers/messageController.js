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


// GET chat log 
exports.chat_get = function(req, res) {
  Message.find().sort([["timestamp", "ascending"]]).populate("author").exec((err, messages) => {
    if (err) { return next(err); }
    let newMessages = [];
    for (let i = 0; i < messages.length; i++) {
      let newMessage = { ...messages[i]._doc };
      let date = messages[i].timestamp;
      newMessage.timestamp = format(date, "d MMM yyyy, h:mm bb");
      newMessages.push(newMessage);
    }
    res.render("chat", {
      title: "Chat Log",
      messages: newMessages
    })
  })
}
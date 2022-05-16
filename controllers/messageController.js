var Message = require("../models/message");
const { body,validationResult } = require("express-validator"); 
const { format } = require("date-fns");

exports.new_msg_get = function(req, res) {
  res.render("newmessage", {
    title: "New Message"
  });
}
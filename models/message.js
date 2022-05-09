var mongoose = require("mongoose");

var Schema = mongoose.Schema; 

var MsgSchema = new Schema (
  {
    author: {type: Schema.Types.ObjectId, ref: "User", required: true}, 
    title: {type: String, required: true},
    text: {type: String, required: true},
    timestamp: {type: Date, required: true},
  }
)

module.exports = mongoose.model("Message", MsgSchema);
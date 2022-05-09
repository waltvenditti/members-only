var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema (
  {
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true},
    member_status: {type: String, required: true, enum: ["user", "member"]},
    admin: {type: Boolean}
  }
)

module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

var { Schema } = mongoose;
var usersSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true
  },
  confirmEmail: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  // issueDate: { type: Date, default: Date.now }
  discount: { type: String }
});
genterateDiscount = getPrice => {
  this.getPrice *= this.discount + 1;
};
usersSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      emial: this.email
    },
    config.get("authkey.JWT")
  );
  return token;
};
module.exports = mongoose.model("users", usersSchema);

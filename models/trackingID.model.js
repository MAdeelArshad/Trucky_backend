const mongoose = require("mongoose");
var { Schema } = mongoose;
var trackingIDSchema = new Schema({
  productID: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  senderAddress: {
    type: String,
    required: true
  },
  isReceived: {
    type: Boolean,
    required: true
  }
});
module.exports = mongoose.model("trackingID", trackingIDSchema);

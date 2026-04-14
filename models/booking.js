const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing"
  },

  checkIn: Date,
  checkOut: Date,

  guests: Number,

  name: String,
  age: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
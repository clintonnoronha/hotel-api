const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: String,
  price: Number,
  rating: Number,
  image: String,
  category: String,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
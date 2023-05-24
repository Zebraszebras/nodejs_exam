const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  title: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  from_location: { type: String, required: true },
  to_location: { type: String, required: true },
  to_location_photo_url: { type: String, required: true },
  _id: { type: String, required: true, minlength: 7 },
});

module.exports = mongoose.model("Ticket", ticketSchema);

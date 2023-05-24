const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  password: { type: String, required: true, minlength: 15 },
  email: { type: String, required: true, minlength: 8 },
  _id: { type: String, required: true, minlength: 3 },
  bought_tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  money_balance: { type: Number, required: true },
});

module.exports = mongoose.model("User", userSchema);

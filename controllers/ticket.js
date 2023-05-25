const uniqid = require("uniqid");
const UserModel = require("../models/user");
const TicketModel = require("../models/ticket");

module.exports.BUY_TICKET = async (req, res) => {
  try { 
    const { title, ticket_price, from_location, to_location, to_location_photo_url, userId } = req.body;
    console.log(`userId: ${userId}`);
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    if (user.money_balance < ticket_price) {
      return res.status(400).json({ response: "Insufficient balance" });
    }

    const newTicket = new TicketModel({
      title: title,
      ticket_price: ticket_price,
      from_location: from_location,
      to_location: to_location,
      to_location_photo_url: to_location_photo_url,
      _id: uniqid(),
    });

    const createdTicket = await newTicket.save();

    const remainingBalance = user.money_balance - ticket_price;
    await UserModel.updateOne(
      { _id: userId },
      { $push: { bought_tickets: createdTicket.id }, money_balance: remainingBalance }
    );

    return res
      .status(200)
      .json({ response: "Ticket was created", remainingBalance });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ response: "ERROR" });
  }
};

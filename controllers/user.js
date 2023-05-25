const uniqid = require("uniqid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TicketModel = require("../models/ticket");
const UserModel = require("../models/user");

function generateJWTToken(userId) {
  const token = jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
      algorithm: "HS256",
    }
  );
  return token;
}

function generateRefreshToken(userId) {
  const refreshToken = jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "24h",
      algorithm: "HS256",
    }
  );

  return refreshToken;
}

module.exports.SIGN_UP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationErrors = validateSignUp(name, email, password);
    if (validationErrors.length > 0) {
      return res.status(400).json(validationErrors);
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ response: "User already exists" });
    }

    const userId = uniqid();
    const nameStartingUppercase = name.charAt(0).toUpperCase() + name.slice(1);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name: nameStartingUppercase,
      password: hashedPassword,
      email,
      money_balance: 0,
      _id: userId,
    });

    await newUser.save();

    const token = generateJWTToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    return res.status(200).json({
      response: "User created",
      jwt: token,
      refreshToken: refreshToken,
      userId: newUser.id,
    });
  } catch (err) {
    console.log("ERR", err);
    return res.status(500).json({ response: "ERROR, please try later" });
  }
};

function validateSignUp(name, email, password) {
  const validationErrors = [];

  if (!name) {
    validationErrors.push("Name is required");
  }

  if (!email) {
    validationErrors.push("Email is required");
  } else {
    if (email.indexOf("@") < 0) {
      validationErrors.push("@ symbol required in Email");
    }
  }

  if (!password) {
    validationErrors.push("Password is required");
  } else if (password.length < 6 || !/\d/.test(password)) {
    validationErrors.push(
      "Password must be at least 6 symbols length and contain at least 1 digit"
    );
  }

  return validationErrors;
}

module.exports.LOG_IN = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ response: "Bad data" });
    }

    bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
      if (isPasswordMatch) {
        const token = generateJWTToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return res.status(200).json({
          response: "You logged in",
          jwt: token,
          refreshToken: refreshToken,
        });
      } else {
        return res.status(401).json({ response: "Bad data" });
      }
    });
  } catch (err) {
    console.log("ERR", err);
    return res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_NEW_JWT_TOKEN = async (req, res) => {
  try {
    const token = generateJWTToken(req.body.userId);
    res.status(200).json({ response: "New JWT token generated", jwt: token });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.JWT_REFRESH_TOKEN = async (req, res) => {
  try {
    const refreshToken = generateRefreshToken(req.body.userId);
    res
      .status(200)
      .json({ response: "JWT token refreshed", refreshToken: refreshToken });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ name: 1 });
    res
      .status(200)
      .json({ users: users.sort((a, b) => a.name.localeCompare(b.name)) });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });

    if (!user) {
      res.status(404).json({ response: "User not found" });
    } else {
      res.status(200).json({ user: user });
    }
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const userId = req.body.userId;

    const aggregatedUserData = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "user_tickets",
        },
      },
    ]).exec();

    if (!aggregatedUserData || aggregatedUserData.length === 0) {
      return res.status(404).json({ response: "User not found" });
    }

    res.status(200).json({ aggregatedUserData });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ response: "Unauthorized" });
    }

    const userId = req.params.userId;

    if (req.user.id !== userId) {
      return res.status(403).json({ response: "Forbidden" });
    }

    const user = await UserModel.findOne({ id: userId }).exec();

    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    const tickets = await TicketModel.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(user.id) },
      },
      { $group: { _id: "$userId", totalTickets: { $sum: 1 } } },
    ]).exec();

    const userWithTickets = {
      id: user.id,
      email: user.email,
      totalTicketsBought: tickets.length > 0 ? tickets[0].totalTickets : 0,
    };

    res.status(200).json({ userWithTickets });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};

module.exports.DEPOSIT = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.body.userId;

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { money_balance: amount } }
    );

    user.money_balance += amount;

    return res.status(200).json({ user });
  } catch (err) {
    console.log("ERR", err);
    return res.status(500).json({ response: "ERROR" });
  }
};

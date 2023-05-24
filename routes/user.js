const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  SIGN_UP,
  LOG_IN,
  GET_NEW_JWT_TOKEN,
  JWT_REFRESH_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
  DEPOSIT
} = require("../controllers/user");


router.post("/user-signup", SIGN_UP);
router.post("/logIn", LOG_IN);
router.get("/new-jwt-token", authMiddleware, GET_NEW_JWT_TOKEN);
router.get("/jwt-refresh-token", authMiddleware, JWT_REFRESH_TOKEN);
router.get("/users", authMiddleware, GET_ALL_USERS);
router.get("/user/:id", authMiddleware, GET_USER_BY_ID);
router.get(
  "/alluserswithtickets/:userId",
  authMiddleware,
  GET_ALL_USERS_WITH_TICKETS
);
router.get(
  "/userwithticket/:userId",
  authMiddleware,
  GET_USER_BY_ID_WITH_TICKETS
);
router.post("/deposit", DEPOSIT);

module.exports = router;

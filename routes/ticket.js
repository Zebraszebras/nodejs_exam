const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { BUY_TICKET } = require("../controllers/ticket");
router.post('/buyticket', authMiddleware, BUY_TICKET);

module.exports = router;
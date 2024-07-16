const express = require("express");
const { sendMoney } = require("../controllers/transaction.controller");
const router = express.Router();

router.post("/send-money", sendMoney);

module.exports = router;

const express = require("express");
const { sendMoney, CashOut } = require("../controllers/transaction.controller");
const router = express.Router();

router.post("/send-money", sendMoney);
router.post("/cash-out", CashOut);

module.exports = router;

const express = require("express");
const { sendMoney, CashOut, CashIn } = require("../controllers/transaction.controller");
const router = express.Router();

router.post("/send-money", sendMoney);
router.post("/cash-out", CashOut);
router.post("/cash-in", CashIn);

module.exports = router;

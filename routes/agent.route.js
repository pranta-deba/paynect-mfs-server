const express = require("express");
const { acceptCashIn } = require("../controllers/agent.controller");
const router = express.Router();

router.patch("/accept-cash-in", acceptCashIn);

module.exports = router;

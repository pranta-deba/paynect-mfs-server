const express = require("express");
const { testRoute } = require("../controllers/test.controller");
const router = express.Router();

router.get("/", testRoute);

module.exports = router;

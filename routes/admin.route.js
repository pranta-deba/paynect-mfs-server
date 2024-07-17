const express = require("express");
const { allTransitions } = require("../controllers/admin.controller");
const { allUsers } = require("../controllers/user.controller");
const router = express.Router();

router.get("/all-transitions", allTransitions);
router.get("/all-users", allUsers);

module.exports = router;

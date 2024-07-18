const express = require("express");
const { allTransitions, statusChange } = require("../controllers/admin.controller");
const { allUsers } = require("../controllers/user.controller");
const router = express.Router();

router.get("/all-transitions", allTransitions);
router.get("/all-users", allUsers);
router.patch("/change-status", statusChange);

module.exports = router;

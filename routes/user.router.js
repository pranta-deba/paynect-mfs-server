const express = require("express");
const { addUser,allUsers, getSingleUser,loginUser } = require("../controllers/user.controller");
const router = express.Router();

router.get("/", allUsers);
router.post("/", addUser);
router.post("/login", loginUser);
router.post("/phone", getSingleUser);

module.exports = router;

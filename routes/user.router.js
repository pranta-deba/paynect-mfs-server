const express = require("express");
const {
  addUser,
  allUsers,
  getSingleUser,
  loginUser,
  allTransitions,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/", allUsers);
router.post("/", addUser);
router.post("/login", loginUser);
router.post("/phone", getSingleUser);
router.post("/all-transitions", allTransitions);

module.exports = router;

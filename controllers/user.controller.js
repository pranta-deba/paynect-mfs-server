const { db } = require("../utils/dbConnect");
const bcrypt = require("bcrypt");
const usersCollection = db.collection("users");
const transactionCollection = db.collection("transaction");
const jwt = require("jsonwebtoken");

// add user
const addUser = async (req, res) => {
  const { name, email, phone, pin, role, bal, image } = req.body;
  const existingUser = await usersCollection.findOne({ phone: phone });
  if (existingUser) {
    return res.status(409).send("User already exists");
  }
  const finalPin = bcrypt.hashSync(pin, 16);
  const result = await usersCollection.insertOne({
    name,
    email,
    phone,
    pinNumber: finalPin,
    role,
    bal,
    image,
  });
  const token = jwt.sign({ phone: phone }, process.env.ACCESS_TOKEN, {
    expiresIn: "1h",
  });
  res.send({ result, token });
};

// all users
const allUsers = async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
};

// get single user
const getSingleUser = async (req, res) => {
  const { phone } = req.body;
  const user = await usersCollection.findOne({ phone: phone });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
    expiresIn: "1h",
  });
  res.send({ token: token, user });
};

// login user
const loginUser = async (req, res) => {
  const { phone, pin } = req.body;
  const user = await usersCollection.findOne({ phone: phone });
  if (!user) {
    return res.send({ message: "Invalid credentials!" });
  }
  const isMatch = bcrypt.compareSync(pin, user.pinNumber);
  if (!isMatch) {
    return res.send({ message: "Incorrect pin!" });
  }
  const token = jwt.sign({ phone: phone }, process.env.ACCESS_TOKEN, {
    expiresIn: "1h",
  });
  res.send({ user, token });
};

// all transactions
const allTransitions = async (req, res) => {
  const { phone } = req.body;
  const result = await transactionCollection
    .find({
      $or: [{ from: phone }, { to: phone }],
    })
    .toArray();
  res.send(result);
};

module.exports = {
  addUser,
  allUsers,
  getSingleUser,
  loginUser,
  allTransitions,
};

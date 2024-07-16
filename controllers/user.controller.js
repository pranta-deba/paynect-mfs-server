const { db } = require("../utils/dbConnect");
const bcrypt = require("bcrypt");
const usersCollection = db.collection("users");

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
  res.send(result);
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
  res.send(user);
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
  res.send(user);
};

module.exports = { addUser, allUsers, getSingleUser, loginUser };

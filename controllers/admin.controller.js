const { db } = require("../utils/dbConnect");
const bcrypt = require("bcrypt");
const transactionCollection = db.collection("transaction");
const usersCollection = db.collection("users");

// add transitions
const allTransitions = async (req, res) => {
  const result = await transactionCollection.find().toArray();
  res.send(result);
};
// add transitions
const allUsers = async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
};

module.exports = { allTransitions, allUsers };

const { ObjectId } = require("mongodb");
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
// change status
const statusChange = async (req, res) => {
  const { id, status } = req.body;
  const updateDoc = {
    $set: {
      status: status,
    },
  };
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    updateDoc
  );
  res.send(result);
};

module.exports = { allTransitions, allUsers, statusChange };

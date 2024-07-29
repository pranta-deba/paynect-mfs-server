const { ObjectId } = require("mongodb");
const { db } = require("../utils/dbConnect");
const transactionCollection = db.collection("transaction");
const usersCollection = db.collection("users");

// all transactions
const acceptCashIn = async (req, res) => {
  const { phone, id, amount, to } = req.body;
  const agent = await usersCollection.findOne({ phone: phone });
  const user = await usersCollection.findOne({ phone: to });

  const newAgentBal = parseInt(agent.bal) - parseInt(amount);
  const updatedAgent = await usersCollection.updateOne(
    { phone: phone },
    { $set: { bal: newAgentBal } }
  );
  const newUserBal = parseInt(user.bal) + parseInt(amount);
  const updatedUser = await usersCollection.updateOne(
    { phone: to },
    { $set: { bal: newUserBal } }
  );
  const result = await transactionCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { approved: true } },
    { upsert: true }
  );
  res.send(result);
};

module.exports = {
  acceptCashIn,
};

const { db } = require("../utils/dbConnect");
const bcrypt = require("bcrypt");
const transactionCollection = db.collection("transaction");
const usersCollection = db.collection("users");

const generateRandomNumber = (length) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};

// sendMoney
const sendMoney = async (req, res) => {
  const { to, pin, from, amount } = req.body;

  const fromUser = await usersCollection.findOne({ phone: from });

  const isMatchPin = bcrypt.compareSync(pin, fromUser.pinNumber);

  if (!isMatchPin) {
    return res.send({ message: "Incorrect pin!" });
  }

  const toUser = await usersCollection.findOne({ phone: to });
  if (!toUser) {
    return res.send({ message: "Please provide a correct number!" });
  }
  const fromBal =
    parseInt(amount) > 100
      ? parseInt(fromUser.bal) + 5 - parseInt(amount)
      : parseInt(fromUser.bal) - parseInt(amount);
  const toBal = parseInt(toUser.bal) + parseInt(amount);

  const updateFrom = await usersCollection.updateOne(
    { phone: from },
    { $set: { bal: fromBal } }
  );

  const updateTo = await usersCollection.updateOne(
    { phone: to },
    { $set: { bal: toBal } }
  );
  const transactionNumber = generateRandomNumber(16);
  const result = await transactionCollection.insertOne({
    to,
    from,
    amount,
    fee: parseInt(amount) > 100 ? 5 : 0,
    date: new Date(),
    system: "send money",
    message: `${fromUser.name} send money of ${amount} tk to ${toUser.name} `,
    transactionNumber,
  });
  const freeAmount = parseInt(amount) > 100 ? 5 : 0;
  if (freeAmount > 0) {
    const admin = await usersCollection.findOne({ role: "admin" });
    const adminBal = parseInt(admin.bal) + freeAmount;
    const updateDoc = {
      $set: {
        bal: adminBal,
      },
    };
    const res = await usersCollection.updateOne({ role: "admin" }, updateDoc);
  }
  res.send(result);
};
// cashout
const CashOut = async (req, res) => {
  const { to, pin, from, amount } = req.body;

  const fromUser = await usersCollection.findOne({ phone: from });

  const isMatchPin = bcrypt.compareSync(pin, fromUser.pinNumber);

  if (!isMatchPin) {
    return res.send({ message: "Incorrect pin!" });
  }
  const toAgent = await usersCollection.findOne({ phone: to });
  if (!toAgent || toAgent.role !== "agent") {
    return res.send({ message: "Please provide a correct agent number!" });
  }
  const fromBal =
    parseInt(fromUser.bal) -
    (Math.round((parseInt(amount) * 1.5) / 100) + parseInt(amount));

  const toBal = parseInt(toAgent.bal) + parseInt(amount);

  const updateFrom = await usersCollection.updateOne(
    { phone: from },
    { $set: { bal: fromBal } }
  );

  const updateTo = await usersCollection.updateOne(
    { phone: to },
    { $set: { bal: toBal } }
  );
  const transactionNumber = generateRandomNumber(16);
  const result = await transactionCollection.insertOne({
    to,
    from,
    amount,
    fee: Math.round((parseInt(amount) * 1.5) / 100),
    date: new Date(),
    system: "cash out",
    message: `${fromUser.name} cash out of ${amount} tk to ${toAgent.name} `,
    transactionNumber,
  });
  const freeAmount = Math.round((parseInt(amount) * 1.5) / 100);
  if (freeAmount > 0) {
    const admin = await usersCollection.findOne({ role: "admin" });
    const adminBal = parseInt(admin.bal) + freeAmount;
    const updateDoc = {
      $set: {
        bal: adminBal,
      },
    };
    const res = await usersCollection.updateOne({ role: "admin" }, updateDoc);
  }
  res.send(result);
};

module.exports = { sendMoney, CashOut };

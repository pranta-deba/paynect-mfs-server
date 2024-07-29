const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

// routes
const testRoute = require("./routes/test.route");
const userRoute = require("./routes/user.router");
const transactionRouter = require("./routes/transaction.route");
const adminRoute = require("./routes/admin.route");
const agentRoute = require("./routes/agent.route");

app.use("/test", testRoute);
app.use("/user", userRoute);
app.use("/transaction", transactionRouter);
app.use("/admin", adminRoute);
app.use("/agent", agentRoute);

app.get("/", async (req, res) => {
  res.send({ data: "Hello, paynect Server!" });
});

app.listen(port, () => {
  console.log("Paynect server is running on port " + port);
});

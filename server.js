require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const hotelRouter = require("./routes/hotel");
const userRouter = require("./routes/user");

const app = express();

const PORT = process.env.PORT;
const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_SECRET}@cluster0.bxlea0m.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URL).then(() => {
  console.log("Connected to MongoDB...");
});

const logger = (req, res, next) => {
  console.log(`${req.method}: Request received on ${'http://' + req.headers.host + req.url}`);
  next();
};

app.use(logger);
app.use(express.json());

app.use("/hotels", hotelRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}...`);
});

app.get("/status", (req, res) => {
  res.send({
    message: "Server is Up and Running.",
    success: true
  });
});

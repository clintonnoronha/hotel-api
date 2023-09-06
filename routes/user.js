const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const dbUser = await User.findOne({ email });
  
  if (dbUser) {
    const isPasswordSame = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordSame) {
      res.status(401).send({
        message: "Invalid Password!"
      });
      return;
    }

    const payload = {
      name: dbUser.name,
      role: dbUser.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.send({
      token: token 
    });

  } else {
    res.status(401).send({
      message: "Invalid User!"
    });
  }
});

router.post("/register", async (req, res) => {
  const user = req.body;
  user.password = await bcrypt.hash(user.password, 10);
  const dbUser = await User.create(user);
  res.send({
    name: dbUser.name,
    role: dbUser.role
  });
});

module.exports = router;
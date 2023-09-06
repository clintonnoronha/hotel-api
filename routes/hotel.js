const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Hotel = require("../models/hotel");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }
  const parsedJWT = jwt.verify(authHeader, process.env.JWT_SECRET);
  req.user = {
    name: parsedJWT.name,
    role: parsedJWT.role,
  };
  next();
};

router.use(verifyToken);

router.get("/", async (req, res) => {
  const query = req.query;
  if (Object.keys(query).length !== 0 && query.constructor === Object) {
    if (query.city) {
      try {
        const hotels = await Hotel.find({city: query.city});
        res.send(hotels);
      } catch (error) {
        res.status(404).send({
          error: "Hotels Not Found!"
        });
      }
    } else if (query.page && query.limit) {
      const page = parseInt(query.page);
      const limit = parseInt(query.limit);
      try {
        const hotels = await Hotel.find().limit(limit).skip((page - 1) * limit).exec();
        const totalHotels = await Hotel.count();
        const totalPages = Math.ceil(totalHotels / limit);
        res.json({
          hotels,
          totalPages: (totalPages === 0) ? 1 : totalPages,
          activePage: page
        });
      } catch (error) {
        res.status(404).send({
          error: "Hotels Not Found!"
        });
      }
    } else {
      res.status(404).send({
        error: "Hotels Not Found!"
      });
    }
  } else {
    try {
      const hotels = await Hotel.find();
      res.send(hotels);
    } catch (error) {
      res.status(404).send({
        error: "Hotels Not Found!"
      });
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.send(hotel);
  } catch (error) {
    res.status(404).send({
      error: "Hotel Not Found!"
    });
  }
});

router.post("/", async (req, res) => {
  const hotel = req.body;
  const user = req.user;
  if (user && user.role === "ADMIN") {
    const newHotel = await Hotel.create(hotel);
    res.send(newHotel);
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
});

router.put("/:id", async (req, res) => {
  const user = req.user;
  if (user && user.role === "ADMIN") {
    try {
      const hotel = req.body;
      const updatedHotel = await Hotel.findByIdAndUpdate({ _id: req.params.id }, hotel);
      res.send({
        message: "Hotel was updated!",
        hotel: updatedHotel
      });
    } catch (error) {
      res.status(404).send({
        error: "Hotel Not Found!"
      });
    }
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
});

router.delete("/:id", async (req, res) => {
  const user = req.user;
  if (user && user.role === "ADMIN") {
    try {
      const hotel = await Hotel.findByIdAndDelete(req.params.id);
      res.send({
        message: "Hotel was deleted!",
        hotel: hotel
      });
    } catch (error) {
      res.status(404).send({
        error: "Hotel Not Found!"
      });
    }
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
});

module.exports = router;
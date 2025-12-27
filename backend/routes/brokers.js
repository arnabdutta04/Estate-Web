const express = require("express");
const router = express.Router();

const {
  getBrokers,
  getBrokerById,
  createBroker,
} = require("../controllers/brokerController");

const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getBrokers);
router.get("/:id", getBrokerById);

// Private route
router.post("/", protect, createBroker);

module.exports = router;

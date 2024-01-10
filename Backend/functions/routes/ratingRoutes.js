const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/ratingController");

router.get("/rate/:mapId", ratingController.getAvgRateByMapId);

// Create or Update
// This also contains logic of updating related avgRate
router.post("/rate/create", ratingController.createOrUpdateRate);

// Delete
// This also contains logic of updating related avgRate
router.delete("/rate/delete/:userId", ratingController.deleteRate);

module.exports = router;

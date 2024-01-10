const express = require("express");

var router = express.Router();

router.get("/", function (req, res, next) {
  res.json({ Test: "I am a test value to confirm CI deployment!" });
});

module.exports = router;

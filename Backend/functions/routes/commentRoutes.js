const express = require("express");
const auth = require("../middleware/auth");

const {
  getComments,
  createComment,
  likeComment,
  dislikeComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

var router = express.Router();

router.get("/comment/:mapId", getComments);
router.post("/comment/create", auth, createComment);
router.post("/comment/like", likeComment);
router.post("/comment/dislike", dislikeComment);
router.put("/comment/update", updateComment);
router.delete("/comment/delete", deleteComment);

module.exports = router;

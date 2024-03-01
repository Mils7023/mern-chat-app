const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addtoGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addtoGroup);
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;

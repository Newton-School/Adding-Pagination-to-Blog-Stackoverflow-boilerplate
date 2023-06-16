const express = require("express");

const { createComment, getComment, deleteComment, updateComment } = require("../controllers/commentControllers");

//Import isoOwnerOrAdmin function from blogMiddleware
const { isoOwnerOrAdmin } = require("../middleware/commentMiddleware");

const router = express.Router();

router.get("/:id", getComment);
router.post("/create", createComment);

//Add comment Protection to delete and patch route.

router.delete("/delete/:id", isoOwnerOrAdmin, deleteComment);
router.patch("/update/:id", isoOwnerOrAdmin, updateComment);

module.exports = router;
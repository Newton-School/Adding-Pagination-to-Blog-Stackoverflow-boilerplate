const express = require("express");

const { getAllBlog, getBlog, createBlog, deleteBlog, updateBlog } = require("../controllers/blogControllers");
const { isoOwnerOrAdmin } = require("../middleware/blogMiddleware");
const router = express.Router();

router.get("/", getAllBlog);
router.get("/:id", getBlog);
router.post("/create", createBlog);
router.post("/delete/:id", isoOwnerOrAdmin, deleteBlog);
router.post("/update/:id", isoOwnerOrAdmin, updateBlog);

module.exports = router;

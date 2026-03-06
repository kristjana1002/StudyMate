const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const RequireAuth = require("../middleware/RequireAuth");
const noteController = require("../controllers/noteController");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB
});

router.post("/upload", RequireAuth, upload.single("file"), noteController.uploadAndSummarize);
router.get("/:id", RequireAuth, noteController.getNoteById);

module.exports = router;
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { generateFlashcards } = require("../controllers/flashcardController");

router.post("/generate", auth, generateFlashcards);

module.exports = router;
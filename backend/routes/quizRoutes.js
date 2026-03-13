const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const quizController = require("../controllers/quizController");

router.post("/generate", auth, quizController.generateQuiz);
router.get("/", auth, quizController.listQuizzes);
router.get("/:id", auth, quizController.getQuizById);
router.post("/:id/submit", auth, quizController.submitQuiz);

module.exports = router;
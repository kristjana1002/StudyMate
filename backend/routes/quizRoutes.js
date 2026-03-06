const express = require("express");
const router = express.Router();

const RequireAuth = require("../middleware/RequireAuth");
const quizController = require("../controllers/quizController");

router.post("/generate", RequireAuth, quizController.generateQuiz);
router.get("/", RequireAuth, quizController.listQuizzes);
router.get("/:id", RequireAuth, quizController.getQuizById);
router.post("/:id/submit", RequireAuth, quizController.submitQuiz);

module.exports = router;
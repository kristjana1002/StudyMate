const Progress = require("../models/Progress");
const Quiz = require("../models/Quiz");
const Note = require("../models/Note");
const Users = require("../models/Users");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id; 



    const studyStreak = await Progress.getStudyStreak(userId);
    const totalStudyHours = await Progress.getTotalStudyHours(userId);
    const avgQuizScore = await Quiz.getAverageScore(userId);
    const topicsMastered = await Progress.getTopicsMastered(userId);



    const weeklyStudyHours = await Progress.getWeeklyStudyHours(userId);


    const subjectPerformance = await Quiz.getSubjectPerformance(userId);



    const studyPlan = await Progress.getTodayStudyPlan(userId);

 

    const recentActivity = await Progress.getRecentActivity(userId);

    res.json({
      user: {
        displayName: req.user.name || "Scholar"
      },
      stats: {
        studyStreakDays: studyStreak,
        topicsMastered,
        avgQuizScore,
        totalStudyHours
      },
      weeklyStudyHours,
      subjectPerformance,
      studyPlan,
      recentActivity
    });

} catch (err) {
  console.error("DASHBOARD ERROR:", err);
  res.status(500).json({ message: "Dashboard failed", error: err.message });
}

};

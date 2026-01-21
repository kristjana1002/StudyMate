# StudyMate
# StudyMate
description
is an ai powered study web designed to help ppl learn
smarter. used to summarize notes, quizzes and much more,it focues on the student weakness to improve it. have different methods depending on how the student best learns

features
can upload notes, pdfs, textbooks  and pics
ai auto summarizes keypoints and notes
creates different types of quizzes 
flashcards
personlized study plan
ai chatbot
progress tracker 
group study mode(maybe?)
voice to text notes



frontend
react + typescript
html + css

backend
nodejs + express

datebase
sql

ai
openai api









---------------------------------------------------


backend/
├── server.js
├── .env
├── config/
│   └── db.js
├── controllers/
│   ├── userController.js
│   ├── noteController.js
│   ├── quizController.js
│   └── aiController.js
├── models/
│   ├── User.js
│   ├── Note.js
│   ├── Quiz.js
│   └── Progress.js
├── routes/
│   ├── userRoutes.js
│   ├── noteRoutes.js
│   ├── quizRoutes.js
│   └── aiRoutes.js
└── utils/
    └── helpers.js


frontend/
├── package.json
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── index.tsx
│   ├── App.tsx
│   ├── styles/
│   │   └── main.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── QuizCard.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── UploadNotes.tsx
│   │   ├── SummaryPage.tsx
│   │   └── QuizPage.tsx
│   ├── context/
│   │   └── UserContext.tsx
│   └── services/
│       └── api.ts






weekly plan: NOT FOR TEACHER EYES
Week 1 (22.01 – 28.01): Planning & Prep
    •    Define full project scope (core + optional features)
    •    Decide tech stack (frontend, backend, DB, AI)
    •    Sketch flow diagram & wireframes for all screens
    •    Setup Git repo/project structure

Goal by Sunday: Clear blueprint of app + project plan ready

⸻

Week 2 (29.01 – 04.02): Backend basics
    •    Initialize Node.js + Express server
    •    Connect database (sql)
    •    Set up basic routes & test connection
    •    Implement simple user authentication (signup/login)

Goal by Sunday: Working backend skeleton with user accounts

⸻

Week 3 (05.02 – 11.02): AI Integration part 1
    •    Connect OpenAI API
    •    Test text summarization for uploaded notes
    •    Test AI-generated quizzes (simple multiple-choice)

Goal by Sunday: Backend ↔ AI working for core functions

⸻

Week 4 (12.02 – 18.02): Frontend basics
    •    Build homepage/dashboard layout
    •    Build note upload screen & summary display
    •    Connect frontend ↔ backend for uploads & summaries

Goal by Sunday: Users can upload notes and get summaries

⸻

Week 5 (19.02 – 25.02): Quizzes & Study Plan
    •    Build quiz interface (MCQs, short answer, flashcards)
    •    Track results per user
    •    AI suggests next topics based on performance

Goal by Sunday: Quiz system + basic personalized study suggestions working

⸻

Week 6 (26.02 – 03.03): Adaptive Learning Modes
    •    Visual learners: diagrams/mind maps
    •    Auditory learners: text-to-speech + simple AI chatbot
    •    Reading/writing learners: editable notes & summaries
    •    Kinesthetic learners: interactive exercises

Goal by Sunday: All adaptive learning modes integrated

⸻

Week 7 (04.03 – 10.03): Progress Tracker & Analytics
    •    Build charts/stats dashboard
    •    Track performance and streaks
    •    AI recommends topics based on progress

Goal by Sunday: Progress tracking + AI suggestions working

⸻

Week 8 (11.03 – 17.03): Optional features (stretch goals)
    •    Gamification: points, streaks, badges
    •    Group study mode (optional)
    •    Voice-to-text note input

Goal by Sunday: Extra features integrated and tested

⸻

Week 9 (18.03 – 24.03): Testing Phase 1
    •    Test every feature individually (upload, summary, quiz, AI chat, adaptive methods)
    •    Fix bugs, make UI tweaks

Goal by Sunday: All features working reliably

⸻

Week 10 (25.03 – 31.03): Integration & Polish
    •    Full app testing: frontend ↔ backend ↔ AI smooth
    •    UI/UX improvements: clean layout, responsive, intuitive

Goal by Sunday: Full app fully integrated & polished

⸻

Week 11 (01.04 – 07.04): Documentation
    •    Write project report: purpose, tech stack, features, implementation, testing, future improvements
    •    Add screenshots, diagrams

Goal by Sunday: Report mostly done, ready for review

⸻

Week 12 (08.04 – 14.04): Final Testing & Presentation Prep
    •    Test app again, fix last-minute bugs
    •    Prepare slides/demo for presentation

Goal by Sunday: App + report + presentation ready

⸻

Week 13 (15.04 – 16.04): Submission & Demo
    •    Final tweaks, finalize everything
    •    Submit project by 16.04
    •    Flex on presentation day 😎 I have the web idea I only made the folders no files nth lets go to terminal and download everything we need
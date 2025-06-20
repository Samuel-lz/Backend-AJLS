const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    progress: {
      totalQuestions: { type: Number, required: true },
      answered: { type: Number, required: true },
      completed: { type: Boolean, default: false },
    },

    answers: [
      {
        questionId: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        selectedOption: { type: String },
        feedback: { type: String },
      },
    ],

    score: {
      correctAnswers: { type: Number, default: 0 },
      wrongAnswers: { type: Number, default: 0 },
      percentage: { type: Number },
      grade: { type: String },
    },

    medal: {
      type: String,
      enum: ["oro", "plata", "bronce", "ninguna"],
      default: "ninguna",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizResult", QuizResultSchema);

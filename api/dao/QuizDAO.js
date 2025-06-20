const User = require("../models/User");

class QuizDAO {
    constructor() {
        this.model = require("../models/Quiz");
    }

    async createOrUpdateProgress(req, res) {
    try {
        const userId = req.user.mongoId;
        const { newAnswer, totalQuestions } = req.body;

        // Buscar intento incompleto
        let quiz = await this.model.findOne({ userId, "progress.completed": false });

        // Si no hay intento, crear uno nuevo
        if (!quiz) {
        quiz = new this.model({
            userId,
            progress: {
            totalQuestions,
            answered: 1,
            completed: false
            },
            answers: [newAnswer],
            score: {
            correctAnswers: 0,
            wrongAnswers: 0
            },
            medal: "ninguna"
        });
        } else {
        // Evitar respuestas duplicadas a la misma pregunta
        const alreadyAnswered = quiz.answers.find(
            (ans) => ans.questionId === newAnswer.questionId
        );
        if (alreadyAnswered) {
            return res.status(400).json({ message: "Esa pregunta ya fue respondida." });
        }

        // Agregar respuesta nueva y aumentar contador
        quiz.answers.push(newAnswer);
        quiz.progress.answered++;

        // Si completó el quiz
        if (quiz.progress.answered === totalQuestions) {
            quiz.progress.completed = true;

            // Contar respuestas correctas e incorrectas
            const correct = quiz.answers.filter((a) => a.isCorrect).length;
            const incorrect = totalQuestions - correct;

            quiz.score.correctAnswers = correct;
            quiz.score.wrongAnswers = incorrect;

            // Asignar medalla
            const ratio = correct / totalQuestions;
            if (ratio === 1) quiz.medal = "oro";
            else if (ratio >= 0.7) quiz.medal = "plata";
            else if (ratio >= 0.5) quiz.medal = "bronce";
            else quiz.medal = "ninguna";
        }
        }

        await quiz.save();
        res.status(201).json({ message: "Intento actualizado", quiz });
    } catch (error) {
        console.error("❌ Error en createOrUpdateProgress:", error);
        res.status(500).json({ error: "Error al guardar el progreso del quiz" });
    }
    }

async getIncompleteByUser(req, res) {
  try {
    const { email } = req.user;
    const user = await require("../models/User").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const quiz = await this.model.findOne({
      userId: user._id,
      "progress.completed": false // ✅ Aquí está el cambio clave
    });

    if (!quiz) {
      return res.status(404).json({ message: "No hay progreso guardado" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: `Error obteniendo progreso: ${error.message}` });
  }
}


    async getAllByUser(req, res) {
        try {
            const { email } = req.user;
            const user = await require("../models/User").findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const results = await this.model.find({ userId: user._id });
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: `Error obteniendo quizzes: ${error.message}` });
        }
    }

}
module.exports = QuizDAO;
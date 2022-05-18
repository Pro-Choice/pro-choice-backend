const router = require("express").Router();
const { query } = require("express");
const pool = require("../db");
const authorization = require("../middleware/authorization");

//Get all questions
router.get("/", authorization, async (req, res) => {
  try {
    const questions = await pool.query("SELECT * FROM questions ORDER BY id DESC");
    res.json(questions.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

//Get all answers for a question
router.get("/questions/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const answers = await pool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [id]
    );
    if (answers.rows.length !== 0) {
      res.json(answers.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

//Answer a question
router.post("/questions/:id", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const { answer } = req.body;
    const { id } = req.params;
    const postAnswer = await pool.query(
      "INSERT INTO answers (content, question_id, user_id) VALUES($1, $2, $3) RETURNING *",
      [answer, id, user_id],
    );
    
    res.json(postAnswer.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

module.exports = router;

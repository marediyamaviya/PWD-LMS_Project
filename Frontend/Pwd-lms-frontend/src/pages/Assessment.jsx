import { useState } from "react";
import { Link } from "react-router-dom";
import assessmentClient from "../api/AssessmentClient";
import "./Assessment.css";

function Assessment() {
  const [quizId, setQuizId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadQuiz = async (event) => {
    event.preventDefault();

    if (!quizId) {
      setMessage("Please enter a quiz ID.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);
    setAnswers({});

    try {
      const response = await assessmentClient.get(`/quizzes/${quizId}`);
      setQuiz(response.data);
    } catch (error) {
      setQuiz(null);
      setMessage(error.response?.data?.message || "Quiz could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const chooseAnswer = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const submitAssessment = async (event) => {
    event.preventDefault();

    const candidateId = localStorage.getItem("email");
    const answerList = Object.keys(answers).map((questionId) => ({
      questionId: Number(questionId),
      optionId: answers[questionId],
    }));

    if (!candidateId) {
      setMessage("Please log in before submitting an assessment.");
      return;
    }

    if (answerList.length !== quiz.questions.length) {
      setMessage("Please answer every question before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await assessmentClient.post(
        `/quizzes/${quiz.id}/attempts`,
        { candidateId, answers: answerList },
      );
      setResult(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Assessment could not be submitted.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="assessment-page">
      <div className="assessment-header">
        <div>
          <p className="assessment-label">PWD LMS</p>
          <h1>Take an Assessment</h1>
          <p>Load a quiz, answer each question, and submit your attempt.</p>
        </div>
        <div className="action-row">
          <Link className="back-link" to="/assessment/manage">
            Manage assessments
          </Link>
          <Link className="back-link" to="/login">
            Log out
          </Link>
        </div>
      </div>

      <section className="assessment-card quiz-loader">
        <h2>Find a quiz</h2>
        <form className="quiz-id-form" onSubmit={loadQuiz}>
          <label htmlFor="quizId">Quiz ID</label>
          <input
            id="quizId"
            type="number"
            min="1"
            value={quizId}
            onChange={(event) => setQuizId(event.target.value)}
            placeholder="Example: 1"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Load Quiz"}
          </button>
        </form>
      </section>

      {message && <p className="assessment-message">{message}</p>}

      {quiz && (
        <form className="assessment-form" onSubmit={submitAssessment}>
          <section className="assessment-card quiz-heading">
            <p className="assessment-label">Quiz {quiz.id}</p>
            <h2>{quiz.title}</h2>
            <p>{quiz.description || "Answer all questions below."}</p>
          </section>

          {quiz.questions.map((question, questionIndex) => (
            <section
              className="assessment-card question-card"
              key={question.id}
            >
              <p className="question-number">
                Question {questionIndex + 1} · {question.points} points
              </p>
              <h3>{question.text}</h3>

              <div className="options-list">
                {question.options.map((option) => (
                  <label className="option" key={option.id}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id] === option.id}
                      onChange={() => chooseAnswer(question.id, option.id)}
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Assessment"}
          </button>
        </form>
      )}

      {result && (
        <section className="assessment-card result-card">
          <p className="assessment-label">Submitted</p>
          <h2>Assessment complete</h2>
          <p>Your score is:</p>
          <strong>
            {result.score} / {result.totalPoints}
          </strong>
        </section>
      )}
    </main>
  );
}

export default Assessment;

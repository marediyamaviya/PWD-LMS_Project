import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import assessmentClient from "../api/AssessmentClient";
import "./Assessment.css";

const MAX_ATTEMPTS = 3;

function Assessment() {
  const role = localStorage.getItem("role");
  const candidateId = localStorage.getItem("email");
  const [searchParams] = useSearchParams();
  const urlQuizId = searchParams.get("quizId");

  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const startQuiz = async (quizId) => {
    setLoading(true);
    setMessage("");
    setResult(null);
    setSubmitted(false);
    try {
      const [quizResponse, attemptsResponse] = await Promise.all([
        assessmentClient.get(`/quizzes/${quizId}`),
        assessmentClient.get(`/quizzes/${quizId}/attempts`, {
          params: { candidateId },
        }),
      ]);
      const loadedAttempts = attemptsResponse.data;
      setAttempts(loadedAttempts);
      setQuiz(quizResponse.data);
      setAnswers({});
      if (loadedAttempts.length >= MAX_ATTEMPTS) {
        setResult(loadedAttempts[0]);
        setMessage("You have used all attempts for this assessment.");
      }
    } catch (error) {
      setQuiz(null);
      setMessage(error.response?.data?.message || "Quiz could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlQuizId) {
      startQuiz(Number(urlQuizId));
    }
  }, [urlQuizId]);

  if (role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "TRAINER") {
    return <Navigate to="/trainer/dashboard" replace />;
  }

  if (role !== "CANDIDATE") {
    return <Navigate to="/login" replace />;
  }

  const searchQuizzes = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setQuiz(null);
    setResult(null);
    try {
      const response = await assessmentClient.get("/quizzes/search", {
        params: { assessmentName: search },
      });
      setQuizzes(response.data);
      if (response.data.length === 0) {
        setMessage("No assessments match that name.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Assessments could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const chooseAnswer = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const submitAssessment = async (event) => {
    event.preventDefault();
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
      setAttempts([response.data, ...attempts]);
      setSubmitted(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Assessment could not be submitted.");
    } finally {
      setLoading(false);
    }
  };

  const canStart = attempts.length < MAX_ATTEMPTS;

  return (
    <main className="assessment-page">
      <div className="assessment-header">
        <div>
          <p className="assessment-label">PWD LMS</p>
          <h1>{quiz ? quiz.title : "Assessments"}</h1>
          <p>{quiz ? (quiz.description || "Answer all questions below.") : "Start a quiz from your courses or quizzes."}</p>
        </div>
        <div className="action-row">
          <Link className="back-link" to="/candidate/dashboard">← Dashboard</Link>
          <Link className="back-link" to="/candidate/quizzes">← My Quizzes</Link>
        </div>
      </div>

      {!urlQuizId && (
        <section className="assessment-card quiz-loader">
          <h2>Find an assessment</h2>
          <form className="quiz-id-form" onSubmit={searchQuizzes}>
            <label htmlFor="assessmentSearch">Assessment name</label>
            <input
              id="assessmentSearch"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Example: Java basics"
            />
            <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          </form>
        </section>
      )}

      {message && <p className="assessment-message">{message}</p>}

      {!urlQuizId && quizzes.length > 0 && (
        <section className="assessment-card">
          <h2>Available assessments</h2>
          <div className="quiz-list">
            {quizzes.map((item) => (
              <div className="quiz-list-item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.description || `${item.questionCount} questions`}</span>
                </div>
                <button type="button" onClick={() => startQuiz(item.id)} disabled={loading}>
                  Start / view
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {loading && urlQuizId && (
        <section className="assessment-card quiz-loader">
          <p className="form-help">Loading quiz...</p>
        </section>
      )}

      {quiz && canStart && !submitted && (
        <form className="assessment-form" onSubmit={submitAssessment}>
          <section className="assessment-card quiz-heading">
            <p className="assessment-label">Quiz {quiz.id}</p>
            <h2>{quiz.title}</h2>
            <p>{quiz.description || "Answer all questions below."}</p>
            <p className="form-help">Attempts used: {attempts.length} / {MAX_ATTEMPTS}</p>
          </section>
          {quiz.questions.map((question, questionIndex) => (
            <section className="assessment-card question-card" key={question.id}>
              <p className="question-number">Question {questionIndex + 1} · {question.points} points</p>
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

      {quiz && !canStart && result && (
        <section className="assessment-card result-card">
          <p className="assessment-label">Attempts complete</p>
          <h2>{quiz.title}</h2>
          <p>You have no attempts remaining. Your latest score is:</p>
          <strong>{result.score} / {result.totalPoints}</strong>
        </section>
      )}

      {result && canStart && (
        <section className="assessment-card result-card">
          <p className="assessment-label">Submitted</p>
          <h2>Assessment complete</h2>
          <p>Your score is:</p>
          <strong>{result.score} / {result.totalPoints}</strong>
        </section>
      )}

      {result && (
        <section className="assessment-card">
          <div className="action-row">
            <Link className="back-link" to="/candidate/dashboard">← Dashboard</Link>
            <Link className="back-link" to="/candidate/quizzes">← My Quizzes</Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Assessment;
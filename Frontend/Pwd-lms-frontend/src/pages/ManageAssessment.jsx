import { useState } from "react";
import { Link } from "react-router-dom";
import assessmentClient from "../api/AssessmentClient";
import "./Assessment.css";

const emptyOptions = [
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false },
];

function ManageAssessment() {
  const role = localStorage.getItem("role");
  const [courseId, setCourseId] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState(emptyOptions);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadQuizzes = async (event) => {
    event.preventDefault();
    if (!courseId) {
      setMessage("Enter a course ID first.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await assessmentClient.get(
        `/courses/${courseId}/quizzes`,
      );
      setQuizzes(response.data);
      setQuiz(null);
      setAttempts([]);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Quizzes could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setMessage("Quiz title is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await assessmentClient.post(
        `/courses/${courseId}/quizzes`,
        {
          title,
          description,
        },
      );
      setQuizzes([...quizzes, response.data]);
      setTitle("");
      setDescription("");
      setMessage("Quiz created successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Quiz could not be created.");
    } finally {
      setLoading(false);
    }
  };

  const openQuiz = async (quizId) => {
    setSelectedQuizId(quizId);
    setLoading(true);
    setMessage("");
    try {
      const response = await assessmentClient.get(`/quizzes/${quizId}`);
      setQuiz(response.data);
      const attemptsResponse = await assessmentClient.get(
        `/quizzes/${quizId}/attempts`,
      );
      setAttempts(attemptsResponse.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Quiz details could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index, text) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], text };
    setOptions(updatedOptions);
  };

  const chooseCorrectOption = (index) => {
    setOptions(
      options.map((option, optionIndex) => ({
        ...option,
        correct: optionIndex === index,
      })),
    );
  };

  const addQuestion = async (event) => {
    event.preventDefault();
    if (!selectedQuizId || !questionText.trim()) {
      setMessage("Select a quiz and enter a question.");
      return;
    }

    if (options.some((option) => !option.text.trim())) {
      setMessage("Every option needs text.");
      return;
    }

    if (!options.some((option) => option.correct)) {
      setMessage("Choose one correct option.");
      return;
    }

    setLoading(true);
    try {
      await assessmentClient.post(`/quizzes/${selectedQuizId}/questions`, {
        text: questionText,
        points: Number(points),
        options,
      });
      setQuestionText("");
      setPoints(1);
      setOptions(emptyOptions);
      await openQuiz(selectedQuizId);
      setMessage("Question added successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Question could not be added.",
      );
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm("Delete this quiz and its questions?")) {
      return;
    }

    try {
      await assessmentClient.delete(`/courses/${courseId}/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((item) => item.id !== quizId));
      if (selectedQuizId === quizId) {
        setSelectedQuizId("");
        setQuiz(null);
        setAttempts([]);
      }
      setMessage("Quiz deleted successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Quiz could not be deleted.");
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await assessmentClient.delete(
        `/quizzes/${selectedQuizId}/questions/${questionId}`,
      );
      await openQuiz(selectedQuizId);
      setMessage("Question deleted successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Question could not be deleted.",
      );
    }
  };

  if (role !== "ADMIN" && role !== "TRAINER") {
    return (
      <main className="assessment-page">
        <section className="assessment-card">
          <h1>Trainer and admin access only</h1>
          <Link className="back-link" to="/assessment">
            Go to assessments
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="assessment-page">
      <div className="assessment-header">
        <div>
          <p className="assessment-label">PWD LMS · {role}</p>
          <h1>Manage Assessments</h1>
          <p>
            Create quizzes, add questions, review attempts, and remove old
            content.
          </p>
        </div>
        <Link className="back-link" to="/assessment">
          Candidate view
        </Link>
      </div>

      <section className="assessment-card">
        <h2>Choose a course</h2>
        <form className="quiz-id-form" onSubmit={loadQuizzes}>
          <label htmlFor="courseId">Course ID</label>
          <input
            id="courseId"
            type="number"
            min="1"
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            placeholder="Example: 1"
          />
          <button type="submit" disabled={loading}>
            Load Quizzes
          </button>
        </form>
      </section>

      {message && <p className="assessment-message">{message}</p>}

      {courseId && (
        <section className="assessment-card">
          <h2>Create quiz</h2>
          <form className="management-form" onSubmit={createQuiz}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Java basics"
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short quiz description"
            />
            <button type="submit" disabled={loading}>
              Create Quiz
            </button>
          </form>
        </section>
      )}

      {quizzes.length > 0 && (
        <section className="assessment-card">
          <h2>Quizzes in course {courseId}</h2>
          <div className="quiz-list">
            {quizzes.map((item) => (
              <div className="quiz-list-item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.questionCount} questions</span>
                </div>
                <div className="action-row">
                  <button type="button" onClick={() => openQuiz(item.id)}>
                    Open
                  </button>
                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => deleteQuiz(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {quiz && (
        <>
          <section className="assessment-card">
            <p className="assessment-label">Quiz {quiz.id}</p>
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <h3>Questions</h3>
            {quiz.questions.length === 0 && <p>No questions yet.</p>}
            {quiz.questions.map((question) => (
              <div className="managed-question" key={question.id}>
                <div>
                  <strong>{question.text}</strong>
                  <span>
                    {question.points} points · {question.options.length} options
                  </span>
                </div>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => deleteQuestion(question.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </section>

          <section className="assessment-card">
            <h2>Add question</h2>
            <form className="management-form" onSubmit={addQuestion}>
              <label htmlFor="questionText">Question</label>
              <textarea
                id="questionText"
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                placeholder="What does JVM stand for?"
              />
              <label htmlFor="points">Points</label>
              <input
                id="points"
                type="number"
                min="1"
                value={points}
                onChange={(event) => setPoints(event.target.value)}
              />
              <p className="form-help">
                Enter four options and select the correct one.
              </p>
              {options.map((option, index) => (
                <div className="option-editor" key={index}>
                  <input
                    value={option.text}
                    onChange={(event) =>
                      updateOption(index, event.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                  />
                  <label>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={option.correct}
                      onChange={() => chooseCorrectOption(index)}
                    />{" "}
                    Correct
                  </label>
                </div>
              ))}
              <button type="submit" disabled={loading}>
                Add Question
              </button>
            </form>
          </section>

          <section className="assessment-card">
            <h2>Attempts</h2>
            {attempts.length === 0 && <p>No attempts yet.</p>}
            {attempts.map((attempt) => (
              <div className="managed-question" key={attempt.id}>
                <div>
                  <strong>{attempt.candidateId}</strong>
                  <span>
                    Score: {attempt.score} / {attempt.totalPoints}
                  </span>
                </div>
                <span>{new Date(attempt.submittedAt).toLocaleString()}</span>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

export default ManageAssessment;

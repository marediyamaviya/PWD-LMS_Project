import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import assessmentClient from "../api/AssessmentClient";
import courseApiClient from "../api/courseApiClient";
import "./Assessment.css";

const newOptions = () => [
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false },
];

function CourseQuizzes() {
  const { courseId } = useParams();
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";
  const canManageQuestions = isAdmin || role === "TRAINER";

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState(newOptions());
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showError = (error, fallback) =>
    setMessage(error.response?.data?.message || fallback);

  const backLink =
    role === "TRAINER"
      ? { to: "/trainer/courses", label: "← My courses" }
      : { to: "/admin/courses", label: "← Course management" };

  const loadCourse = async () => {
    try {
      const response = await courseApiClient.get(`courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      setCourse(null);
      showError(error, "Course could not be loaded.");
    }
  };

  const loadQuizzes = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await assessmentClient.get(`/quizzes/course/${courseId}`);
      setQuizzes(response.data);
      setQuiz(null);
      setAttempts([]);
      setSelectedQuizId("");
    } catch (error) {
      showError(error, "Quizzes for this course could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    loadQuizzes();
  }, [courseId]);

  const createQuiz = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setMessage("Quiz title is required.");
      return;
    }
    setLoading(true);
    try {
      await assessmentClient.post("/quizzes", {
        title: title.trim(),
        description,
        courseId: Number(courseId),
      });
      setTitle("");
      setDescription("");
      setCreatingQuiz(false);
      await loadQuizzes();
      setMessage("Quiz created successfully.");
    } catch (error) {
      showError(error, "Quiz could not be created.");
    } finally {
      setLoading(false);
    }
  };

  const openQuiz = async (quizId) => {
    setSelectedQuizId(quizId);
    setLoading(true);
    setMessage("");
    try {
      const [quizResponse, attemptsResponse] = await Promise.all([
        assessmentClient.get(`/quizzes/${quizId}`),
        assessmentClient.get(`/quizzes/${quizId}/attempts`),
      ]);
      setQuiz(quizResponse.data);
      setAttempts(attemptsResponse.data);
      setEditingQuiz(false);
      setEditingQuestionId(null);
    } catch (error) {
      showError(error, "Quiz details could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm("Delete this quiz and its questions?")) return;
    try {
      await assessmentClient.delete(`/quizzes/${quizId}`);
      setQuizzes((current) => current.filter((item) => item.id !== quizId));
      if (selectedQuizId === quizId) {
        setSelectedQuizId("");
        setQuiz(null);
        setAttempts([]);
      }
      setMessage("Quiz deleted successfully.");
    } catch (error) {
      showError(error, "Quiz could not be deleted.");
    }
  };

  const saveQuiz = async (event) => {
    event.preventDefault();
    try {
      const response = await assessmentClient.put(`/quizzes/${quiz.id}`, {
        title: quiz.title,
        description: quiz.description,
        courseId: Number(courseId),
      });
      setQuiz({
        ...quiz,
        title: response.data.title,
        description: response.data.description,
        courseId: response.data.courseId,
      });
      setQuizzes((current) =>
        current.map((item) => (item.id === quiz.id ? { ...item, ...response.data } : item)),
      );
      setEditingQuiz(false);
      setMessage("Quiz details updated.");
    } catch (error) {
      showError(error, "Quiz details could not be updated.");
    }
  };

  const updateOption = (index, text) => {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? { ...option, text } : option));
  };

  const chooseCorrect = (index) => {
    setOptions((current) =>
      current.map((option, optionIndex) => ({
        ...option,
        correct: optionIndex === index,
      })));
  };

  const addOption = () => {
    setOptions((current) => [...current, { text: "", correct: false }]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      setMessage("A question must have at least two options.");
      return;
    }
    setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index));
  };

  const addQuestion = async (event) => {
    event.preventDefault();
    if (!questionText.trim() || options.some((option) => !option.text.trim())) {
      setMessage("Enter the question and every option.");
      return;
    }
    if (!options.some((option) => option.correct)) {
      setMessage("Choose one correct option.");
      return;
    }
    try {
      await assessmentClient.post(`/quizzes/${selectedQuizId}/questions`, {
        text: questionText,
        points: Number(points),
        options,
      });
      setQuestionText("");
      setPoints(1);
      setOptions(newOptions());
      await openQuiz(selectedQuizId);
      setMessage("Question added successfully.");
    } catch (error) {
      showError(error, "Question could not be added.");
    }
  };

  const startEditingQuestion = (question) => {
    setEditingQuestionId(question.id);
    setEditingQuestion({
      text: question.text,
      points: question.points,
      options: question.options.map((option) => ({
        text: option.text,
        correct: option.correct,
      })),
    });
  };

  const changeEditingOption = (index, value) => {
    setEditingQuestion({
      ...editingQuestion,
      options: editingQuestion.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, text: value } : option),
    });
  };

  const chooseEditingCorrect = (index) => {
    setEditingQuestion({
      ...editingQuestion,
      options: editingQuestion.options.map((option, optionIndex) => ({
        ...option,
        correct: optionIndex === index,
      })),
    });
  };

  const saveQuestion = async (event, questionId) => {
    event.preventDefault();
    if (
      !editingQuestion.text.trim() ||
      editingQuestion.options.some((option) => !option.text.trim()) ||
      !editingQuestion.options.some((option) => option.correct)
    ) {
      setMessage("Enter all question fields and choose one correct option.");
      return;
    }
    try {
      await assessmentClient.put(
        `/quizzes/${selectedQuizId}/questions/${questionId}`,
        { ...editingQuestion, points: Number(editingQuestion.points) },
      );
      await openQuiz(selectedQuizId);
      setEditingQuestionId(null);
      setEditingQuestion(null);
      setMessage("Question updated.");
    } catch (error) {
      showError(error, "Question could not be updated.");
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!selectedQuizId || !questionId) {
      setMessage("Select a quiz question before deleting.");
      return;
    }
    setLoading(true);
    setMessage("Deleting question...");
    try {
      await assessmentClient.delete(
        `/quizzes/${selectedQuizId}/questions/${questionId}`,
      );
      await openQuiz(selectedQuizId);
      setMessage("Question deleted successfully.");
    } catch (error) {
      showError(error, "Question could not be deleted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="assessment-page">
      <div className="assessment-header">
        <div>
          <p className="assessment-label">PWD LMS · {role}</p>
          <h1>{course ? course.title : "Course quizzes"}</h1>
          <p>{course ? course.description || "No description provided." : "Manage the quizzes for this course."}</p>
        </div>
        <div className="action-row">
          <Link
            className="back-link"
            to={role === "ADMIN" ? "/admin/dashboard" : "/trainer/dashboard"}
          >
            ← {role === "ADMIN" ? "Admin" : "Trainer"} Dashboard
          </Link>
          <Link className="back-link" to={backLink.to}>{backLink.label}</Link>
        </div>
      </div>

      {message && <p className="assessment-message">{message}</p>}

      <section className="assessment-card">
        <div className="quiz-detail-header">
          <div>
            <h2>Quizzes</h2>
            <p>{quizzes.length === 0 ? "No quizzes have been created for this course yet." : `${quizzes.length} quiz${quizzes.length === 1 ? "" : "zes"} for this course.`}</p>
          </div>
          <button
            className="create-quiz-button"
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              setCreatingQuiz(true);
            }}
          >
            Create new quiz
          </button>
        </div>

        {loading && <p className="form-help">Loading quizzes...</p>}

        <div className="quiz-list">
          {quizzes.map((item) => (
            <div className="quiz-list-item" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.questionCount} questions</span>
              </div>
              <div className="action-row">
                <button type="button" onClick={() => openQuiz(item.id)}>View</button>
                <button className="danger-button" type="button" onClick={() => deleteQuiz(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {quiz && (
        <>
          <section className="assessment-card">
            <div className="quiz-detail-header">
              <div>
                <p className="assessment-label">Quiz {quiz.id}</p>
                <h2>{quiz.title}</h2>
                <p>{quiz.description || "No description provided."}</p>
              </div>
              {isAdmin && <button type="button" onClick={() => setEditingQuiz(!editingQuiz)}>{editingQuiz ? "Cancel" : "Edit details"}</button>}
            </div>
            <h3>Questions and answers</h3>
            {quiz.questions.length === 0 && <p>No questions yet.</p>}
            {quiz.questions.map((question, index) => (
              <div className="managed-question question-details" key={question.id}>
                <div>
                  <strong>{index + 1}. {question.text}</strong>
                  <span>{question.points} points</span>
                  <div className="answer-options">
                    {question.options.map((option) => (
                      <span className={option.correct ? "answer-option correct-answer" : "answer-option"} key={option.id}>
                        {option.text}{option.correct ? " (correct)" : ""}
                      </span>
                    ))}
                  </div>
                </div>
                {canManageQuestions && (
                  <div className="action-row">
                    {isAdmin && (
                      <button type="button" onClick={() => startEditingQuestion(question)}>Edit</button>
                    )}
                    <button
                      className="danger-button"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      disabled={loading}
                    >
                      Delete question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>

          {canManageQuestions && (
            <section className="assessment-card">
              <h2>Add question</h2>
              <form className="management-form" onSubmit={addQuestion}>
                <label htmlFor="questionText">Question</label>
                <textarea id="questionText" value={questionText} onChange={(event) => setQuestionText(event.target.value)} />
                <label htmlFor="points">Points</label>
                <input id="points" type="number" min="1" value={points} onChange={(event) => setPoints(event.target.value)} />
                {options.map((option, index) => (
                  <div className="option-editor" key={index}>
                    <input value={option.text} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} />
                    <label><input type="radio" name="newCorrectOption" checked={option.correct} onChange={() => chooseCorrect(index)} /> Correct</label>
                    <button
                      className="secondary-button danger-button"
                      type="button"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      Remove option
                    </button>
                  </div>
                ))}
                <button className="secondary-button" type="button" onClick={addOption}>
                  Add option
                </button>
                <button type="submit">Add Question</button>
              </form>
            </section>
          )}

          <section className="assessment-card">
            <h2>Attempts</h2>
            {attempts.length === 0 && <p>No attempts yet.</p>}
            {attempts.map((attempt) => (
              <div className="managed-question" key={attempt.id}>
                <div><strong>{attempt.candidateId}</strong><span>Score: {attempt.score} / {attempt.totalPoints}</span></div>
                <span>{new Date(attempt.submittedAt).toLocaleString()}</span>
              </div>
            ))}
          </section>
        </>
      )}

      {isAdmin && editingQuiz && quiz && (
        <div className="edit-modal-backdrop" role="presentation">
          <section className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="editQuizTitle">
            <div className="edit-modal-header">
              <h2 id="editQuizTitle">Edit assessment</h2>
              <button className="modal-close-button" type="button" onClick={() => setEditingQuiz(false)}>
                Close
              </button>
            </div>
            <form className="management-form" onSubmit={saveQuiz}>
              <label htmlFor="editTitle">Assessment name</label>
              <input id="editTitle" value={quiz.title} onChange={(event) => setQuiz({ ...quiz, title: event.target.value })} />
              <label htmlFor="editDescription">Description</label>
              <textarea id="editDescription" value={quiz.description || ""} onChange={(event) => setQuiz({ ...quiz, description: event.target.value })} />
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setEditingQuiz(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>Save assessment</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {creatingQuiz && (
        <div className="edit-modal-backdrop" role="presentation">
          <section className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="createQuizTitle">
            <div className="edit-modal-header">
              <h2 id="createQuizTitle">Create new quiz</h2>
              <button className="modal-close-button" type="button" onClick={() => setCreatingQuiz(false)}>
                Close
              </button>
            </div>
            <form className="management-form" onSubmit={createQuiz}>
              <label htmlFor="newQuizTitle">Assessment name</label>
              <input
                id="newQuizTitle"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
              />
              <label htmlFor="newQuizDescription">Description</label>
              <textarea
                id="newQuizDescription"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <label htmlFor="newQuizCourseId">Course (required)</label>
              <input
                id="newQuizCourseId"
                value={course ? course.title : `Course ${courseId}`}
                readOnly
                disabled
              />
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setCreatingQuiz(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create quiz"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isAdmin && editingQuestionId && editingQuestion && (
        <div className="edit-modal-backdrop" role="presentation">
          <section className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="editQuestionTitle">
            <div className="edit-modal-header">
              <h2 id="editQuestionTitle">Edit question</h2>
              <button className="modal-close-button" type="button" onClick={() => {
                setEditingQuestionId(null);
                setEditingQuestion(null);
              }}>
                Close
              </button>
            </div>
            <form className="management-form" onSubmit={(event) => saveQuestion(event, editingQuestionId)}>
              <label htmlFor="editQuestionText">Question</label>
              <textarea id="editQuestionText" value={editingQuestion.text} onChange={(event) => setEditingQuestion({ ...editingQuestion, text: event.target.value })} />
              <label htmlFor="editQuestionPoints">Points</label>
              <input id="editQuestionPoints" type="number" min="1" value={editingQuestion.points} onChange={(event) => setEditingQuestion({ ...editingQuestion, points: event.target.value })} />
              {editingQuestion.options.map((option, index) => (
                <div className="option-editor" key={index}>
                  <input value={option.text} onChange={(event) => changeEditingOption(index, event.target.value)} />
                  <label><input type="radio" name="editCorrectOption" checked={option.correct} onChange={() => chooseEditingCorrect(index)} /> Correct</label>
                </div>
              ))}
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => {
                  setEditingQuestionId(null);
                  setEditingQuestion(null);
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>Save question</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default CourseQuizzes;
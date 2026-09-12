import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import assessmentClient from "../../../api/AssessmentClient";
import apiClient from "../../../api/ApiClient";
import courseApiClient from "../../../api/courseApiClient";

const MAX_ATTEMPTS = 3;

function CandidateQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuizzes = async () => {
      const email = localStorage.getItem("email");

      if (!email) {
        setError("Candidate email not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const candidateResponse = await apiClient.get(
          `users/email/${encodeURIComponent(email)}`,
        );
        const candidateId = candidateResponse.data.id;
        const enrollmentsResponse = await courseApiClient.get("courses/enrolled", {
          params: { candidateId },
        });

        const quizGroups = await Promise.all(
          enrollmentsResponse.data.map(async (enrollment) => {
            const [courseResponse, quizzesResponse] = await Promise.all([
              courseApiClient.get(`courses/${enrollment.courseId}`),
              assessmentClient.get(`/courses/${enrollment.courseId}/quizzes`),
            ]);

            return Promise.all(
              quizzesResponse.data.map(async (quiz) => {
                const attemptsResponse = await assessmentClient.get(
                  `/quizzes/${quiz.id}/attempts`,
                  { params: { candidateId: email } },
                );

return {
                  ...quiz,
                  courseName: courseResponse.data.title,
                  attemptCount: attemptsResponse.data.length,
                };
              }),
            );
          }),
        );

        setQuizzes(quizGroups.flat());
      } catch (requestError) {
        console.error("Error fetching candidate quizzes:", requestError);
        setError(requestError.response?.data?.message || "Unable to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            My Quizzes
          </h2>

          <p className="text-muted mb-0">
            Quizzes available for your enrolled courses.
          </p>
        </div>

        <Link
          to="/candidate/dashboard"
          className="btn btn-secondary"
        >
          Back to Dashboard
        </Link>

      </div>

      {/* Quiz Table */}
      <div className="card shadow-sm">

        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Available Quizzes
          </h5>

          {loading && <p className="text-muted">Loading quizzes...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && quizzes.length === 0 && (
            <p className="text-muted">No quizzes are available for your enrolled courses yet.</p>
          )}

          {!loading && !error && quizzes.length > 0 && (
          <div className="table-responsive">

            <table className="table table-bordered table-hover">

<thead className="table-light">

                <tr>
                  <th>#</th>
                  <th>Quiz</th>
                  <th>Course</th>
                  <th>Questions</th>
                  <th>Attempts</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {quizzes.map((quiz, index) => (

                  <tr key={quiz.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td className="fw-semibold">
                      {quiz.title}
                    </td>

                    <td>
                      {quiz.courseName}
                    </td>

                    <td>
                      {quiz.questionCount}
                    </td>

                    <td>
                      {quiz.attemptCount} / {MAX_ATTEMPTS}
                    </td>

                    <td>

                      {quiz.attemptCount >= MAX_ATTEMPTS ? (
                        <span className="badge bg-secondary">
                          Completed
                        </span>
                      ) : quiz.attemptCount > 0 ? (
                        <span className="badge bg-warning text-dark">
                          In Progress
                        </span>
                      ) : (
                        <span className="badge bg-success">
                          Available
                        </span>
                      )}

                    </td>

                    <td>

                      {quiz.attemptCount >= MAX_ATTEMPTS ? (

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled
                        >
                          Completed
                        </button>

                      ) : (

                        <Link
                          to={`/candidate/assessment?quizId=${quiz.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Start Quiz
                        </Link>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default CandidateQuizzes;

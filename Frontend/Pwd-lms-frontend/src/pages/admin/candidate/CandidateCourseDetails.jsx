import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import courseApiClient from "../../../api/courseApiClient";
import assessmentClient from "../../../api/AssessmentClient";
import apiClient from "../../../api/ApiClient";

function CandidateCourseDetails() {

  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [trainerName, setTrainerName] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startingModule, setStartingModule] = useState(null);
  const [completingModule, setCompletingModule] = useState(null);

  // Get candidate ID
  useEffect(() => {

    const fetchCandidate = async () => {

      try {

        const email = localStorage.getItem("email");

        if (!email) {
          setError("Candidate email not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await apiClient.get(
          `users/email/${encodeURIComponent(email)}`
        );

        setCandidateId(response.data.id);

      } catch (err) {

        console.error("Error fetching candidate:", err);

        setError("Unable to get candidate information.");
        setLoading(false);
      }
    };

    fetchCandidate();

  }, []);


  // Get course, modules and enrollment progress
  useEffect(() => {

    if (!courseId || !candidateId) {
      return;
    }

    const fetchCourseDetails = async () => {

      try {

        setLoading(true);
        setError("");

        // Get course
        const courseResponse = await courseApiClient.get(
          `courses/${courseId}`
        );

        setCourse(courseResponse.data);

        // Get trainer name
        try {

          const trainersResponse = await apiClient.get("users/role/TRAINER");

          const trainer = (trainersResponse.data || []).find(
            (item) => Number(item.id) === Number(courseResponse.data.trainerId)
          );

          setTrainerName(trainer ? trainer.name : null);

        } catch (trainerErr) {

          console.error("Error fetching trainer:", trainerErr);

          setTrainerName(null);

        }


        // Get modules
        const modulesResponse = await courseApiClient.get(
          `courses/${courseId}/modules`
        );

        setModules(modulesResponse.data);


        // Get quizzes for this course
        try {

          const quizzesResponse = await assessmentClient.get(
            `/quizzes/course/${courseId}`
          );

          setQuizzes(quizzesResponse.data);

        } catch (quizErr) {

          console.error(
            "Error fetching quizzes:",
            quizErr
          );

          setQuizzes([]);

        }


        // Get enrolled courses to get current progress
        const enrollmentResponse = await courseApiClient.get(
          "courses/enrolled",
          {
            params: {
              candidateId: candidateId
            }
          }
        );

        const enrollment = enrollmentResponse.data.find(
          (item) =>
            Number(item.courseId) === Number(courseId)
        );

        if (enrollment) {
          setCourseProgress(
            enrollment.progressPercent || 0
          );
        }

      } catch (err) {

        console.error(
          "Error fetching course details:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load course details."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchCourseDetails();

  }, [courseId, candidateId]);


  // Start module
  const handleStartModule = (moduleId) => {

    setStartingModule(moduleId);

  };


  // Mark module complete
  const handleCompleteModule = async (moduleId) => {

    if (!candidateId) {
      alert("Candidate information not available.");
      return;
    }

    try {

      setCompletingModule(moduleId);

      await courseApiClient.patch(
        `courses/${courseId}/modules/${moduleId}/progress`,
        null,
        {
          params: {
            candidateId: candidateId,
            progressPercent: 100
          }
        }
      );

      // Fetch updated enrollment progress
      const enrollmentResponse =
        await courseApiClient.get(
          "courses/enrolled",
          {
            params: {
              candidateId: candidateId
            }
          }
        );

      const enrollment = enrollmentResponse.data.find(
        (item) =>
          Number(item.courseId) === Number(courseId)
      );

      if (enrollment) {

        setCourseProgress(
          enrollment.progressPercent || 0
        );

      }

      alert("Module completed successfully.");

    } catch (err) {

      console.error(
        "Error updating module progress:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Unable to update module progress."
      );

    } finally {

      setCompletingModule(null);

    }

  };


  // Loading
  if (loading) {

    return (
      <div className="container py-5 text-center">

        <div className="spinner-border text-primary">
        </div>

        <p className="text-muted mt-3">
          Loading course details...
        </p>

      </div>
    );

  }


  // Error
  if (error) {

    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/candidate/courses"
          className="btn btn-primary"
        >
          Back to My Courses
        </Link>

        <Link
          to="/candidate/dashboard"
          className="btn btn-outline-secondary"
        >
          Back to Dashboard
        </Link>

      </div>
    );

  }


  // Course not found
  if (!course) {

    return (
      <div className="container py-5">

        <h3>
          Course not found
        </h3>

        <Link
          to="/candidate/courses"
          className="btn btn-primary mt-3"
        >
          Back to My Courses
        </Link>

        <Link
          to="/candidate/dashboard"
          className="btn btn-outline-secondary mt-3 ms-2"
        >
          Back to Dashboard
        </Link>

      </div>
    );

  }


  return (

    <div className="container py-5">

      {/* Back Button */}
      <div className="mb-4 d-flex justify-content-between align-items-center">

        <Link
          to="/candidate/courses"
          className="text-decoration-none"
        >
          ← Back to My Courses
        </Link>

        <Link
          to="/candidate/dashboard"
          className="btn btn-outline-secondary btn-sm"
        >
          ← Dashboard
        </Link>

      </div>


      {/* Course Header */}
      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h2 className="fw-bold mb-3">
            {course.title}
          </h2>

          <p className="mb-2">
            <strong>Trainer:</strong>{" "}
            {trainerName || `Trainer #${course.trainerId}`}
          </p>

          <p className="mb-2">
            <strong>Duration:</strong>{" "}
            {course.duration}
          </p>

          <p className="mb-2">
            <strong>Category:</strong>{" "}
            {course.category}
          </p>

          <p className="text-muted">
            {course.description}
          </p>


          {/* [Commented out - Course Progress]
          <div className="mt-4">

            <div className="d-flex justify-content-between">

              <strong>
                Course Progress
              </strong>

              <span>
                {courseProgress}%
              </span>

            </div>

            <div className="progress mt-2">

              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${courseProgress}%`
                }}
              >
              </div>

            </div>

          </div>
          */}

        </div>

      </div>


      {/* Course Content */}
      <div className="card shadow-sm">

        <div className="card-body">

          <h4 className="fw-bold mb-4">
            Course Content
          </h4>


          {/* No Modules */}
          {modules.length === 0 && (

            <div className="alert alert-info">
              No modules have been added to this course yet.
            </div>

          )}


          {/* Modules */}
          {modules.length > 0 && (

            <div className="list-group">

              {modules.map((module) => (

                <div
                  className="list-group-item"
                  key={module.id}
                >

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <h6 className="fw-bold mb-1">

                        Module {module.moduleOrder}
                        {" - "}
                        {module.title}

                      </h6>

                    </div>


                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        handleStartModule(module.id)
                      }
                    >

                      {startingModule === module.id
                        ? "Started"
                        : "Start"}

                    </button>

                  </div>


                  {/* Module Content */}
                  {startingModule === module.id && (

                    <div className="mt-3">

                      <div className="border rounded p-3 bg-light">

                        <p className="mb-0">
                          {module.content}
                        </p>

                      </div>


                      {/* Complete Module */}
                      <div className="mt-3">

                        <button
                          className="btn btn-success"
                          disabled={
                            completingModule === module.id
                          }
                          onClick={() =>
                            handleCompleteModule(module.id)
                          }
                        >

                          {completingModule === module.id
                            ? "Updating..."
                            : "Mark as Complete"}

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}


          {/* Course Quizzes */}
          <div className="mt-4">

            <h4 className="fw-bold mb-3">
              Course Quizzes
            </h4>

            {/* No Quizzes */}
            {quizzes.length === 0 && (

              <div className="alert alert-info">
                No quizzes have been added to this course yet.
              </div>

            )}

            {/* Quizzes Table */}
            {quizzes.length > 0 && (

              <div className="table-responsive">

                <table className="table table-bordered table-hover">

                  <thead className="table-light">

                    <tr>
                      <th>#</th>
                      <th>Quiz</th>
                      <th>Description</th>
                      <th>Questions</th>
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
                          {quiz.description || "-"}
                        </td>

                        <td>
                          {quiz.questionCount}
                        </td>

                        <td>

                          <Link
                            to={`/candidate/assessment?quizId=${quiz.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            Start Quiz
                          </Link>

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

    </div>

  );
}

export default CandidateCourseDetails;
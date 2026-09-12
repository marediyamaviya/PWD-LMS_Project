import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import courseApiClient from "../../../api/courseApiClient";
import apiClient from "../../../api/ApiClient";

function CandidateCourses() {

  const [courses, setCourses] = useState([]);
  const [candidateId, setCandidateId] = useState(null);
  const [trainersById, setTrainersById] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchTrainers = async () => {

      try {

        const response = await apiClient.get("users/role/TRAINER");

        const trainerMap = {};

        (response.data || []).forEach((trainer) => {
          trainerMap[trainer.id] = trainer.name;
        });

        setTrainersById(trainerMap);

      } catch (err) {

        console.error("Error fetching trainers:", err);

      }

    };

    fetchTrainers();

  }, []);

  // Get candidate ID from logged-in user's email
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


  // Get enrolled courses
  useEffect(() => {

    if (!candidateId) {
      return;
    }

    const fetchEnrolledCourses = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await courseApiClient.get(
          "courses/enrolled",
          {
            params: {
              candidateId: candidateId
            }
          }
        );

        const enrollments = response.data;

        /*
         * Enrollment only contains courseId.
         * So we fetch the actual course information
         * for each enrollment.
         */
        const courseDetails = await Promise.all(

          enrollments.map(async (enrollment) => {

            try {

              const courseResponse =
                await courseApiClient.get(
                  `courses/${enrollment.courseId}`
                );

              return {
                id: courseResponse.data.id,
                name: courseResponse.data.title,
                trainer: courseResponse.data.trainerId,
                duration: courseResponse.data.duration,
                progress: enrollment.progressPercent,
                status: enrollment.status
              };

            } catch (err) {

              console.error(
                `Error fetching course ${enrollment.courseId}:`,
                err
              );

              return null;
            }

          })

        );

        // Remove courses that could not be loaded
        setCourses(
          courseDetails.filter((course) => course !== null)
        );

      } catch (err) {

        console.error(
          "Error fetching enrolled courses:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load your enrolled courses."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchEnrolledCourses();

  }, [candidateId]);


  return (

    <div className="container py-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">

        <div>

          <h2 className="fw-bold">
            My Courses
          </h2>

          <p className="text-muted mb-0">
            Courses you are currently enrolled in.
          </p>

        </div>

        <Link
          to="/candidate/dashboard"
          className="btn btn-outline-secondary"
        >
          ← Back to Dashboard
        </Link>

      </div>


      {/* Error */}
      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {/* Loading */}
      {loading && (

        <div className="text-center py-5">

          <div className="spinner-border text-primary">
          </div>

          <p className="text-muted mt-3">
            Loading your courses...
          </p>

        </div>

      )}


      {/* No courses */}
      {!loading && courses.length === 0 && !error && (

        <div className="alert alert-info">

          You are not enrolled in any courses yet.

          <div className="mt-3">

            <Link
              to="/candidate/new-courses"
              className="btn btn-success"
            >
              Explore New Courses
            </Link>

          </div>

        </div>

      )}


      {/* Courses */}
      {!loading && courses.length > 0 && (

        <div className="row">

          {courses.map((course) => (

            <div
              className="col-md-4 mb-4"
              key={course.id}
            >

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="fw-bold mb-3">
                    {course.name}
                  </h5>


                  <p className="mb-2">
                    <strong>Trainer:</strong>{" "}
                    {trainersById[course.trainer] || `Trainer #${course.trainer}`}
                  </p>


                  <p className="mb-3">
                    <strong>Duration:</strong>{" "}
                    {course.duration}
                  </p>


                  {/* Progress */}
                  {/* [Commented out - Progress bar]
                  <div className="mb-3">

                    <div className="d-flex justify-content-between">

                      <small className="text-muted">
                        Progress
                      </small>

                      <small className="fw-semibold">
                        {course.progress}%
                      </small>

                    </div>


                    <div className="progress mt-1">

                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${course.progress}%`
                        }}
                      >
                      </div>

                    </div>

                  </div>
                  */}


                  {/* View Course */}
                  <Link
                    to={`/candidate/course/${course.id}`}
                    className="btn btn-primary w-100"
                  >
                    View Course
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default CandidateCourses;
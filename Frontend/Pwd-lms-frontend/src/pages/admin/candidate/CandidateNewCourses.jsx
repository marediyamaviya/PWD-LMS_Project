import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import courseApiClient from "../../../api/courseApiClient";
import apiClient from "../../../api/ApiClient";

function CandidateNewCourses() {

  const [courses, setCourses] = useState([]);
  const [candidateId, setCandidateId] = useState(null);
  const [trainersById, setTrainersById] = useState({});

  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState("");

  // Get candidate ID from logged-in user's email
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const email = localStorage.getItem("email");

        if (!email) {
          setError("Candidate email not found. Please login again.");
          return;
        }

        const response = await apiClient.get(
          `users/email/${encodeURIComponent(email)}`
        );

        setCandidateId(response.data.id);

      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("Unable to get candidate information.");
      }
    };

    fetchCandidate();
  }, []);

  // Get courses the candidate is not enrolled in
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const [coursesResponse, enrollmentsResponse] = await Promise.all([
          courseApiClient.get("courses"),
          courseApiClient.get("courses/enrolled", {
            params: { candidateId },
          }),
        ]);

        const enrolledCourseIds = new Set(
          (enrollmentsResponse.data || []).map(
            (enrollment) => enrollment.courseId
          ),
        );

        setCourses(
          (coursesResponse.data || []).filter(
            (course) => !enrolledCourseIds.has(course.id)
          ),
        );

      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Unable to load available courses.");
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCourses();
    }
  }, [candidateId]);

  // Get trainer names
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

  // Enroll candidate
  const handleEnroll = async (courseId, courseTitle) => {

    if (!candidateId) {
      alert("Candidate information is not available. Please login again.");
      return;
    }

    try {

      setEnrollingId(courseId);

      await courseApiClient.post(
        `courses/${courseId}/enroll`,
        null,
        {
          params: {
            candidateId: candidateId
          }
        }
      );

      alert(`You have successfully enrolled in ${courseTitle}.`);

    } catch (err) {

      console.error("Enrollment error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to enroll in this course.";

      alert(message);

    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">New Courses</h2>

          <p className="text-muted mb-0">
            Courses you are not yet enrolled in.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link
            to="/candidate/courses"
            className="btn btn-primary"
          >
            My Courses
          </Link>

          <Link
            to="/candidate/dashboard"
            className="btn btn-secondary"
          >
            Back to Dashboard
          </Link>
        </div>

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
          <div className="spinner-border text-primary"></div>
          <p className="mt-3 text-muted">
            Loading available courses...
          </p>
        </div>
      )}

      {/* No courses */}
      {!loading && courses.length === 0 && !error && (
        <div className="alert alert-info">
          You are enrolled in all available courses.
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

                <div className="card-body d-flex flex-column">

                  <h5 className="fw-bold mb-3">
                    {course.title}
                  </h5>

                  <p className="mb-2">
                    <strong>Category:</strong>{" "}
                    {course.category}
                  </p>

                  <p className="mb-2">
                    <strong>Duration:</strong>{" "}
                    {course.duration}
                  </p>

                  <p className="mb-2">
                    <strong>Trainer:</strong>{" "}
                    {trainersById[course.trainerId] || `Trainer #${course.trainerId}`}
                  </p>

                  <p className="text-muted">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-3">

                    <button
                      className="btn btn-success w-100"
                      disabled={enrollingId === course.id}
                      onClick={() =>
                        handleEnroll(
                          course.id,
                          course.title
                        )
                      }
                    >

                      {enrollingId === course.id
                        ? "Enrolling..."
                        : "Enroll Now"}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default CandidateNewCourses;
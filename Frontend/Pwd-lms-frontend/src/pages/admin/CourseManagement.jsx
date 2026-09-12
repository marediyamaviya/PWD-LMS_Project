import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import courseApiClient from "../../api/courseApiClient";
import apiClient from "../../api/ApiClient";

function CourseManagement() {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [trainersById, setTrainersById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTrainerName = (trainerId) => {
    if (!trainerId) {
      return "Not assigned";
    }

    return trainersById[trainerId] || `Trainer #${trainerId}`;
  };

  const fetchCourses = async () => {

    try {

      setLoading(true);
      setError("");

      const coursesResponse = await courseApiClient.get("courses");
      setCourses(coursesResponse.data);

      try {
        const trainersResponse = await apiClient.get("admin/trainers");
        const trainerMap = {};
        (trainersResponse.data || []).forEach((trainer) => {
          trainerMap[trainer.id] = trainer.name;
        });
        setTrainersById(trainerMap);
      } catch (trainerError) {
        console.error("Error fetching trainers:", trainerError);
      }

    } catch (error) {

      console.error("Error fetching courses:", error);

      if (error.response?.status === 403) {

        setError(
          "You are not authorized to view courses."
        );

      } else {

        setError(
          "Failed to load courses."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await courseApiClient.delete(
        `courses/${courseId}`
      );

      alert("Course deleted successfully.");

      setCourses(
        courses.filter(
          (course) => course.id !== courseId
        )
      );

    } catch (error) {

      console.error(
        "Error deleting course:",
        error
      );

      if (error.response?.status === 403) {

        alert(
          "You are not authorized to delete this course."
        );

      } else {

        alert(
          "Failed to delete course."
        );

      }

    }
  };

  const handleEdit = (course) => {

    navigate(
      `/admin/edit-course/${course.id}`,
      {
        state: {
          course
        }
      }
    );

  };

  return (

    <div className="container-fluid min-vh-100 bg-light">

      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3">

        <div>

          <span className="navbar-brand fw-bold text-primary">
            PWD LMS
          </span>

          <span className="text-muted ms-2">
            Admin Panel
          </span>

        </div>

        <div className="d-flex align-items-center gap-3">

          <Link
            to="/admin/dashboard"
            className="btn btn-outline-primary btn-sm"
          >
            Dashboard
          </Link>

          <span className="fw-semibold">
            Admin
          </span>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {

              localStorage.clear();

              window.location.href = "/login";

            }}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Main Content */}
      <div className="container py-5">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

          <div>

            <h2 className="fw-bold">
              Course Management
            </h2>

            <p className="text-muted mb-md-0">
              Create, view, update and delete LMS courses.
            </p>

          </div>

          <Link
            to="/admin/create-course"
            className="btn btn-primary fw-semibold mt-3 mt-md-0"
          >
            + Create Course
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

            <div
              className="spinner-border text-primary"
              role="status"
            >
            </div>

            <p className="text-muted mt-3">
              Loading courses...
            </p>

          </div>

        )}

        {/* Empty */}
        {!loading &&
          !error &&
          courses.length === 0 && (

            <div className="card border-0 shadow-sm">

              <div className="card-body text-center py-5">

                <div className="fs-1 mb-3">
                  📚
                </div>

                <h5 className="fw-bold">
                  No Courses Found
                </h5>

                <p className="text-muted">
                  Create your first course to get started.
                </p>

                <Link
                  to="/admin/create-course"
                  className="btn btn-primary"
                >
                  Create Course
                </Link>

              </div>

            </div>

          )}

        {/* Courses */}
        {!loading &&
          courses.length > 0 && (

            <div className="row g-4">

              {courses.map((course) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={course.id}
                >

                  <div className="card border-0 shadow-sm h-100">

                    <div className="card-body p-4">

                      {/* Course Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">

                        <span className="fs-1">
                          📚
                        </span>

                        <span
                          className={`badge ${
                            course.status === "PUBLISHED"
                              ? "bg-success"
                              : course.status === "ARCHIVED"
                              ? "bg-secondary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {course.status}
                        </span>

                      </div>

                      {/* Course Title */}
                      <h5 className="fw-bold">
                        {course.title}
                      </h5>

                      {/* Description */}
                      <p className="text-muted">
                        {course.description}
                      </p>

                      {/* Course Details */}
                      <div className="small text-muted mb-3">

                        <div className="mb-1">

                          <strong>
                            Category:
                          </strong>{" "}

                          {course.category}

                        </div>

                        <div className="mb-1">

                          <strong>
                            Duration:
                          </strong>{" "}

                          {course.duration}

                        </div>

                        <div>

                          <strong>
                            Trainer:
                          </strong>{" "}

                          {getTrainerName(course.trainerId)}

                        </div>

                      </div>

                      {/* Buttons */}
                      <div className="d-flex gap-2">

                        <Link
                          className="btn btn-outline-primary btn-sm flex-grow-1"
                          to={`/admin/courses/${course.id}`}
                        >
                          Quizzes
                        </Link>

                        <button
                          className="btn btn-outline-primary btn-sm flex-grow-1"
                          onClick={() =>
                            handleEdit(course)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm flex-grow-1"
                          onClick={() =>
                            handleDelete(course.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </div>
  );
}

export default CourseManagement;
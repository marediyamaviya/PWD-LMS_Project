import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import courseApiClient from "../../api/courseApiClient";

function MyCourses() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await courseApiClient.get("courses/my");

      console.log("My Courses:", response.data);

      setCourses(response.data);

    }  catch (error) {
  console.error("FULL ERROR:", error);
  console.error("STATUS:", error.response?.status);
  console.error("RESPONSE:", error.response?.data);
  console.error("HEADERS:", error.response?.headers);

  setError(
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Failed to load your courses."
  );


    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">

      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="d-flex justify-content-between align-items-center">

          <div>
            <h4 className="fw-bold mb-1">
              My Courses
            </h4>

            <p className="text-muted mb-0">
              View and manage the courses assigned to you.
            </p>
          </div>

          <Link
            to="/trainer/dashboard"
            className="btn btn-outline-secondary"
          >
            ← Dashboard
          </Link>

        </div>
      </div>


      {/* Main Content */}
      <div className="container py-5">

        {/* Page Heading */}
        <div className="mb-4">
          <h2 className="fw-bold">
            My Courses
          </h2>

          <p className="text-muted">
            Courses that you are responsible for conducting.
          </p>
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
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-3">
              Loading your courses...
            </p>
          </div>
        )}


        {/* No Courses */}
        {!loading && !error && courses.length === 0 && (
          <div className="row">
            <div className="col-md-6 col-lg-4">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body p-4">

                  <div className="mb-3">
                    <span className="fs-1">
                      📚
                    </span>
                  </div>

                  <h4 className="fw-bold">
                    No Courses Yet
                  </h4>

                  <p className="text-muted">
                    Courses assigned to you will appear here.
                  </p>

                </div>

              </div>

            </div>
          </div>
        )}


        {/* Course Cards */}
        {!loading && courses.length > 0 && (
          <div className="row g-4">

            {courses.map((course) => (

              <div
                className="col-md-6 col-lg-4"
                key={course.id}
              >

                <div className="card border-0 shadow-sm h-100">

                  <div className="card-body p-4">

                    <div className="mb-3">
                      <span className="fs-1">
                        📚
                      </span>
                    </div>

                    <h4 className="fw-bold">
                      {course.title}
                    </h4>

                    <p className="text-muted">
                      {course.description}
                    </p>

                    <div className="mb-2">
                      <strong>Category:</strong>{" "}
                      {course.category}
                    </div>

                    <div className="mb-2">
                      <strong>Duration:</strong>{" "}
                      {course.duration}
                    </div>

                    <div className="mb-3">
                      <strong>Status:</strong>{" "}
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

                    <Link
                      to={`/trainer/courses/${course.id}`}
                      className="btn btn-primary"
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

    </div>
  );
}

export default MyCourses;
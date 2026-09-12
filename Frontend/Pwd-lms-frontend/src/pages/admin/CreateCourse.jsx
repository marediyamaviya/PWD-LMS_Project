import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import courseApiClient from "../../api/courseApiClient";
import apiClient from "../../api/ApiClient";

function CreateCourse() {

  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    trainerId: "",
    status: "DRAFT"
  });

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await apiClient.get("admin/trainers");
        setTrainers(response.data || []);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to load trainers. Please try again.");
      }
    };

    fetchTrainers();
  }, []);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setCourse({
      ...course,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const requestData = {
        title: course.title,
        description: course.description,
        category: course.category,
        duration: course.duration,
        trainerId: Number(course.trainerId),
        status: course.status
      };

      await courseApiClient.post(
        "courses",
        requestData
      );

      alert("Course created successfully.");

      navigate("/admin/courses");

    } catch (error) {

      console.error("Error creating course:", error);

      if (error.response?.status === 403) {

        setError(
          "You are not authorized to create a course."
        );

      } else {

        setError(
          error.response?.data?.message ||
          "Failed to create course."
        );
      }

    } finally {

      setLoading(false);

    }
  };

  const handleCancel = () => {
    navigate("/admin/courses");
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

        </div>

      </nav>

      {/* Main Content */}
      <div className="container py-5">

        {/* Page Header */}
        <div className="mb-4">

          <h2 className="fw-bold">
            Create New Course
          </h2>

          <p className="text-muted">
            Add a new course to the PWD LMS platform.
          </p>

        </div>

        {/* Error */}
        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}

        {/* Course Form */}
        <div className="card border-0 shadow-sm">

          <div className="card-body p-4 p-md-5">

            <h5 className="fw-bold mb-4">
              Course Information
            </h5>

            <form onSubmit={handleSubmit}>

              {/* Course Title */}
              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Course Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter course title"
                  required
                />

              </div>

              {/* Description */}
              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Course Description
                </label>

                <textarea
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  placeholder="Enter course description"
                  required
                />

              </div>

              {/* Category + Duration */}
              <div className="row">

                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Course Category
                  </label>

                  <select
                    name="category"
                    value={course.category}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="PROGRAMMING">
                      Programming
                    </option>

                    <option value="WEB_DEVELOPMENT">
                      Web Development
                    </option>

                    <option value="DATABASE">
                      Database
                    </option>

                    <option value="OTHER">
                      Other
                    </option>

                  </select>

                </div>

                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Course Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={course.duration}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. 3 Months"
                    required
                  />

                </div>

              </div>

              {/* Assign Trainer */}
              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Assign Trainer
                </label>

                <select
                  name="trainerId"
                  value={String(course.trainerId)}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select trainer
                  </option>

                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={String(trainer.id)}>
                      {trainer.name}
                    </option>
                  ))}
                </select>

                {trainers.length === 0 && (
                  <small className="text-muted">
                    No trainers found. Create a trainer first.
                  </small>
                )}

              </div>

              {/* Status */}
              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Course Status
                </label>

                <select
                  name="status"
                  value={course.status}
                  onChange={handleChange}
                  className="form-select"
                >

                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="ARCHIVED">
                    Archived
                  </option>

                </select>

              </div>

              {/* Buttons */}
              <div className="d-flex gap-3 pt-3">

                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={loading}
                >

                  {loading
                    ? "Creating..."
                    : "Create Course"}

                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 fw-semibold"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateCourse;
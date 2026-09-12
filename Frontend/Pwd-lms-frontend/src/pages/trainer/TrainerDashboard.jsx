import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import courseApiClient from "../../api/courseApiClient";
import apiClient from "../../api/ApiClient";
import assessmentClient from "../../api/AssessmentClient";

function TrainerDashboard() {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    myCourses: 0,
    candidates: 0,
    assessments: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [coursesResponse, candidatesResponse] = await Promise.all([
          courseApiClient.get("courses/my"),
          apiClient.get("users/role/CANDIDATE"),
        ]);

        const courses = coursesResponse.data || [];

        const quizCounts = await Promise.all(
          courses.map((course) =>
            assessmentClient
              .get(`/quizzes/course/${course.id}`)
              .then((response) => response.data.length)
              .catch(() => 0),
          ),
        );

        setStats({
          myCourses: courses.length,
          candidates: (candidatesResponse.data || []).length,
          assessments: quizCounts.reduce((sum, count) => sum + count, 0),
        });
      } catch (error) {
        console.error("Error loading trainer dashboard stats:", error);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white p-4">
          <h3 className="mb-4">PWD LMS</h3>

          <div className="mb-4">
            <small className="text-secondary">TRAINER</small>
          </div>

          {/* <div className="mb-3">
            Dashboard
          </div>*/}

          <Link
            to="/trainer/courses"
            className="d-block mb-3 text-white text-decoration-none"
          >
            My Courses
          </Link>
          <div className="mb-3">
            <Link
              className="text-white text-decoration-none"
              to="/assessment/manage"
            >
              Manage Assessments
            </Link>
          </div>
          <Link
            to="/trainer/candidates"
            className="d-block mb-3 text-white text-decoration-none"
          >
            Candidates
          </Link>

          {/*<div className="mb-3">
            Profile
          </div>*/}

          <button className="btn btn-danger mt-4" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          {/* Header */}
          <div className="mb-4">
            <h2>Trainer Dashboard</h2>

            <p className="text-muted">Welcome back, {email}</p>
          </div>

          {/* Dashboard Cards */}
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">My Courses</h6>

                  <h2>{stats.myCourses}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Candidates</h6>

                  <h2>{stats.candidates}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Assessments</h6>

                  <h2>{stats.assessments}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h5>Account Information</h5>

              <p className="mb-1">
                <strong>Email:</strong> {email}
              </p>

              <p className="mb-0">
                <strong>Role:</strong> {role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerDashboard;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/ApiClient";
import courseApiClient from "../../../api/courseApiClient";
import assessmentClient from "../../../api/AssessmentClient";

function CandidateDashboard() {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    myCourses: 0,
    newCourses: 0,
    quizzes: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!email) {
        return;
      }

      try {
        const candidateResponse = await apiClient.get(
          `users/email/${encodeURIComponent(email)}`,
        );
        const candidateId = candidateResponse.data.id;

        const [coursesResponse, enrollmentsResponse] = await Promise.all([
          courseApiClient.get("courses"),
          courseApiClient.get("courses/enrolled", {
            params: { candidateId },
          }),
        ]);

        const quizCounts = await Promise.all(
          enrollmentsResponse.data.map((enrollment) =>
            assessmentClient
              .get(`/quizzes/course/${enrollment.courseId}`)
              .then((response) => response.data.length)
              .catch(() => 0),
          ),
        );

        setStats({
          myCourses: enrollmentsResponse.data.length,
          newCourses: Math.max(
            coursesResponse.data.length - enrollmentsResponse.data.length,
            0,
          ),
          quizzes: quizCounts.reduce((sum, count) => sum + count, 0),
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
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
            <small className="text-secondary">CANDIDATE</small>
          </div>

          {/*<div className="mb-3">
            Dashboard
          </div>*/}

          <Link
            to="/candidate/courses"
            className="d-block mb-3 text-white text-decoration-none"
          >
            My Courses
          </Link>

          <Link
            to="/candidate/new-courses"
            className="d-block mb-3 text-white text-decoration-none"
          >
            New Courses
          </Link>

          {/* [Commented out - Attendance]
          <Link
            to="/candidate/attendance"
            className="d-block mb-3 text-white text-decoration-none"
          >
            Attendance
          </Link>
          */}

          <Link
            to="/candidate/quizzes"
            className="d-block mb-3 text-white text-decoration-none"
          >
            My Quizzes
          </Link>

          {/*<div className="mb-3">
            Profile
          </div>*/}

          <button
            className="btn btn-danger mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>


        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">

          {/* Header */}
          <div className="mb-4">

            <h2>Candidate Dashboard</h2>

            <p className="text-muted">
              Welcome back, {email}
            </p>

          </div>


          {/* Dashboard Cards */}
          <div className="row">

            {/* My Courses */}
            <div className="col-md-3 mb-4">

              <div className="card shadow-sm">

                <div className="card-body">

                  <h6 className="text-muted">
                    My Courses
                  </h6>

                  <h2>{stats.myCourses}</h2>

                  <p className="text-muted mb-0">
                    Enrolled courses
                  </p>

                </div>

              </div>

            </div>


            {/* New Courses */}
            <div className="col-md-3 mb-4">

              <div className="card shadow-sm">

                <div className="card-body">

                  <h6 className="text-muted">
                    New Courses
                  </h6>

                  <h2>{stats.newCourses}</h2>

                  <p className="text-muted mb-0">
                    Available courses
                  </p>

                </div>

              </div>

            </div>


            {/* Attendance */}
            {/* [Commented out - Attendance]
            <div className="col-md-3 mb-4">

              <div className="card shadow-sm">

                <div className="card-body">

                  <h6 className="text-muted">
                    Attendance
                  </h6>

                  <h2>0%</h2>

                  <p className="text-muted mb-0">
                    Overall attendance
                  </p>

                </div>

              </div>

            </div>
            */}


            {/* Quizzes */}
            <div className="col-md-3 mb-4">

              <div className="card shadow-sm">

                <div className="card-body">

                  <h6 className="text-muted">
                    My Quizzes
                  </h6>

                  <h2>{stats.quizzes}</h2>

                  <p className="text-muted mb-0">
                    Available quizzes
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* My Courses Section */}
          <div className="card shadow-sm mt-3">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">
                  My Enrolled Courses
                </h5>

                <Link
                  to="/candidate/courses"
                  className="btn btn-sm btn-primary"
                >
                  View Courses
                </Link>

              </div>

              <p className="text-muted mb-0">
                You are enrolled in {stats.myCourses} course{stats.myCourses === 1 ? "" : "s"}.
              </p>

            </div>

          </div>


          {/* New Courses Section */}
          <div className="card shadow-sm mt-4">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">
                  New Courses
                </h5>

                <Link
                  to="/candidate/new-courses"
                  className="btn btn-sm btn-success"
                >
                  Explore Courses
                </Link>

              </div>

              <p className="text-muted mb-0">
                {stats.newCourses} course{stats.newCourses === 1 ? "" : "s"} are available for enrollment.
              </p>

            </div>

          </div>


          {/* Attendance Section */}
          {/* [Commented out - Attendance]
          <div className="card shadow-sm mt-4">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">
                  Attendance
                </h5>

                <Link
                  to="/candidate/attendance"
                  className="btn btn-sm btn-info"
                >
                  View Attendance
                </Link>

              </div>

              <p className="text-muted mb-0">
                Your course attendance details will appear here.
              </p>

            </div>

          </div>
          */}


          {/* Quiz Section */}
          <div className="card shadow-sm mt-4 mb-4">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="mb-0">
                  My Quizzes
                </h5>

                <Link
                  to="/candidate/quizzes"
                  className="btn btn-sm btn-warning"
                >
                  View Quizzes
                </Link>

              </div>

              <p className="text-muted mb-0">
                {stats.quizzes} quiz{stats.quizzes === 1 ? "" : "zes"} related to your enrolled courses
                are available.
              </p>

            </div>

          </div>


          {/* Account Information */}
          <div className="card shadow-sm mt-4">

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

export default CandidateDashboard;
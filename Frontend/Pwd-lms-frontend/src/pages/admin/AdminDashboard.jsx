import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3">
        <div>
          <span className="navbar-brand fw-bold text-primary">PWD LMS</span>
          <span className="text-muted ms-2">Admin Panel</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">Admin</span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        {/* Welcome */}
        <div className="mb-5">
          <h2 className="fw-bold">Welcome, Admin 👋</h2>

          <p className="text-muted">
            Manage trainers, coordinators and attendance from here.
          </p>
        </div>

        {/* User Management */}
        <h5 className="fw-bold mb-3">User Management</h5>

        <div className="row g-4 mb-5">
          {/* Create Trainer */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="mb-3">
                  <span className="fs-1">👨‍🏫</span>
                </div>

                <h4 className="fw-bold">Trainer Management</h4>

                <p className="text-muted">
                  Create and manage trainer accounts for the LMS.
                </p>

                <Link to="/admin/create-trainer" className="btn btn-primary">
                  Create Trainer
                </Link>
              </div>
            </div>
          </div>

          {/* Candidate Management */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="mb-3">
                  <span className="fs-1">👤</span>
                </div>

                <h4 className="fw-bold">Candidate Management</h4>

                <p className="text-muted">
                  View all the candidates registered on the platform.
                </p>

                <Link to="/admin/candidates" className="btn btn-primary">
                  View Candidates
                </Link>
              </div>
            </div>
          </div>

          {/* Create Coordinator
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="mb-3">
                  <span className="fs-1">👨‍💼</span>
                </div>

                <h4 className="fw-bold">Coordinator Management</h4>

                <p className="text-muted">
                  Create and manage coordinator accounts for the LMS.
                </p>

                <Link
                  to="/admin/create-coordinator"
                  className="btn btn-primary"
                >
                  Create Coordinator
                </Link>
              </div>
            </div>
          </div>
          */}
        </div>

        <h5 className="fw-bold mb-3">Course Management</h5>

        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">
            <h4 className="fw-bold">Courses</h4>
            <p className="text-muted">Create, update, and manage LMS courses.</p>
            <Link to="/admin/courses" className="btn btn-primary">Manage Courses</Link>
          </div>
        </div>
        <h5 className="fw-bold mb-3">Assessment Management</h5>

        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">
            <h4 className="fw-bold">Quizzes and Questions</h4>
            <p className="text-muted">
              Create quizzes, add questions, review attempts and delete old
              assessments.
            </p>
            <Link to="/assessment/manage" className="btn btn-primary">
              Manage Assessments
            </Link>
          </div>
        </div>

        {/* Attendance Management */}
        {/*<h5 className="fw-bold mb-3">Attendance Management</h5>*/}

        {/*<div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                  <div className="mb-2">
                    <span className="fs-1">📋</span>
                  </div>

                  <h4 className="fw-bold">Attendance Management</h4>

                  <p className="text-muted mb-md-0">
                    View and manage learner attendance records.
                  </p>
                </div>

                <Link to="/admin/attendance" className="btn btn-primary">
                  Manage Attendance
                </Link>
              </div>
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
}

export default AdminDashboard;

function TrainerDashboard() {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

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

          <div className="mb-3">
            Dashboard
          </div>

          <div className="mb-3">
            My Courses
          </div>

          <div className="mb-3">
            Candidates
          </div>

          <div className="mb-3">
            Profile
          </div>

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
            <h2>Trainer Dashboard</h2>

            <p className="text-muted">
              Welcome back, {email}
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="row">

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">
                    My Courses
                  </h6>

                  <h2>0</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">
                    Candidates
                  </h6>

                  <h2>0</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">
                    Pending Tasks
                  </h6>

                  <h2>0</h2>
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
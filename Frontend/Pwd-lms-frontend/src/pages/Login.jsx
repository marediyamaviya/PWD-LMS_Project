import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/ApiClient";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      console.log("Login successful:", data);

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "TRAINER") {
        navigate("/trainer/dashboard");
      } else if (data.role === "CANDIDATE") {
        navigate("/candidate/dashboard");
      } else {
        console.log("Unknown role:", data.role);
      }

    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        alert(error.response.data.message || "Invalid email or password");
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="row w-100 justify-content-center">

        <div className="col-11 col-sm-8 col-md-6 col-lg-4">

          <div className="card shadow-lg border-0">

            <div className="card-body p-4 p-md-5">

              {/* Header */}
              <div className="text-center mb-4">

                <h2 className="fw-bold text-primary">
                  PWD LMS
                </h2>

                <p className="text-muted mb-0">
                  Learning Management System
                </p>

              </div>

              <hr />

              {/* Login Heading */}
              <div className="mb-4">

                <h4 className="fw-semibold">
                  Welcome Back
                </h4>

                <p className="text-muted">
                  Please login to your account
                </p>

              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin}>

                {/* Email */}
                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

                {/* Password */}
                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>

                {/* Login Button */}
                <div className="d-grid">

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                  >
                    Login
                  </button>

                </div>

              </form>

              {/* Register */}
              <p className="text-center text-muted mt-4 mb-0">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Register here
                </Link>

              </p>

            </div>

          </div>

          {/* Footer */}
          <p className="text-center text-muted small mt-3">
            © 2026 PWD LMS
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
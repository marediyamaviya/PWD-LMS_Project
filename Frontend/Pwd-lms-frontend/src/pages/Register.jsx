import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/ApiClient";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CANDIDATE",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Password validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(formData.password)) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );
      return;
    }

    // Confirm password
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await apiClient.post(
        "/auth/register",
        formData
      );

      console.log("Registration successful:", response.data);

      alert("Registration successful. Please login.");

      // Go back to Login page
      navigate("/login");

    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Registration failed."
        );
      } else {
        alert("Unable to connect to server.");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="row w-100 justify-content-center">

        <div className="col-11 col-sm-8 col-md-6 col-lg-5">

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

              {/* Registration Heading */}
              <div className="mb-4">

                <h4 className="fw-semibold">
                  Create Candidate Account
                </h4>

                <p className="text-muted">
                  Register to access PWD LMS
                </p>

              </div>

              <form onSubmit={handleRegister}>

                {/* Name */}
                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Email */}
                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* Password */}
                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <div className="form-text">
                    Minimum 8 characters with uppercase, lowercase,
                    number and special character.
                  </div>

                </div>

                {/* Confirm Password */}
                <div className="mb-4">

                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    required
                  />

                </div>

                {/* Register Button */}
                <div className="d-grid">

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                  >
                    Create Account
                  </button>

                </div>

              </form>

              {/* Login Link */}
              <p className="text-center text-muted mt-4 mb-0">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Login here
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

export default Register;
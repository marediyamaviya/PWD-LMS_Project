import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/ApiClient";

function CreateTrainer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/auth/register", {
        ...formData,
        role: "TRAINER",
      });

      console.log("Trainer created:", response.data);

      alert("Trainer created successfully!");

      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Failed to create trainer:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Failed to create trainer."
        );
      } else {
        alert("Unable to connect to server.");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">

      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3">

        <span className="navbar-brand fw-bold text-primary">
          PWD LMS
        </span>

        <div className="d-flex align-items-center gap-3">

          <Link
            to="/admin/dashboard"
            className="btn btn-outline-primary btn-sm"
          >
            Dashboard
          </Link>

          <span className="fw-semibold">
            Admin Panel
          </span>

        </div>

      </nav>


      {/* Main Content */}
      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-12 col-md-8 col-lg-6">

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4 p-md-5">

                <div className="mb-4">

                  <h3 className="fw-bold">
                    Create Trainer
                  </h3>

                  <p className="text-muted">
                    Create a new trainer account.
                  </p>

                </div>


                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="Enter trainer name"
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
                      placeholder="Enter trainer email"
                      value={formData.email}
                      onChange={handleChange}
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
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* Buttons */}
                  <div className="d-flex gap-2">

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                    >
                      Create Trainer
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateTrainer;
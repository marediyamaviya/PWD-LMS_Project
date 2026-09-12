import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/ApiClient";

function Candidates() {
  const role = localStorage.getItem("role");
  const isTrainer = role === "TRAINER";
  const isAdmin = role === "ADMIN";
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const backLink = isTrainer ? "/trainer/dashboard" : "/admin/dashboard";
  const backLabel = "← Dashboard";

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiClient.get("users/role/CANDIDATE");
        setCandidates(response.data || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load candidates."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Delete candidate (admin only)
  const handleDelete = async (candidate) => {
    if (!window.confirm(
      `Delete candidate "${candidate.name}" (${candidate.email})? This cannot be undone.`,
    )) {
      return;
    }

    try {
      setDeletingId(candidate.id);
      setError("");
      await apiClient.delete(`users/${candidate.id}`);
      setCandidates((prev) =>
        prev.filter((c) => c.id !== candidate.id),
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete candidate. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1">Candidates</h4>
            <p className="text-muted mb-0">
              View all the candidates registered on the platform.
            </p>
          </div>
          <Link to={backLink} className="btn btn-outline-secondary">
            {backLabel}
          </Link>
        </div>
      </div>

      <div className="container py-5">
        <div className="mb-4">
          <h2 className="fw-bold">All Candidates</h2>
          <p className="text-muted">
            {candidates.length} candidate{candidates.length === 1 ? "" : "s"} registered.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3">Loading candidates...</p>
          </div>
        )}

        {!loading && !error && candidates.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <div className="fs-1 mb-3">👤</div>
              <h4 className="fw-bold">No Candidates Yet</h4>
              <p className="text-muted">Registered candidates will appear here.</p>
            </div>
          </div>
        )}

        {!loading && candidates.length > 0 && (
          <div className="row g-4">
            {candidates.map((candidate) => (
              <div className="col-md-6 col-lg-4" key={candidate.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <span className="fs-1">👤</span>
                    </div>
                    <h4 className="fw-bold mb-0">{candidate.name}</h4>
                    <p className="text-muted mb-0">{candidate.email}</p>
                    <div className="mt-3">
                      <span className="badge bg-info text-dark">{candidate.role}</span>
                    </div>

                    {isAdmin && (
                      <div className="mt-3 pt-3 border-top">
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          disabled={deletingId === candidate.id}
                          onClick={() => handleDelete(candidate)}
                        >
                          {deletingId === candidate.id
                            ? "Deleting..."
                            : "Delete Candidate"}
                        </button>
                      </div>
                    )}
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

export default Candidates;
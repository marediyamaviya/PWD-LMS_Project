import axios from "axios";

const assessmentClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/assessment/`,
});

assessmentClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = ["Bearer", token].join(" ");
  }

  return config;
});

export default assessmentClient;

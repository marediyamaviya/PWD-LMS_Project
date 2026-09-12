import axios from "axios";

const courseApiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://lms-api-gateway-c51u.onrender.com"}/api/course/`,
});

courseApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default courseApiClient;
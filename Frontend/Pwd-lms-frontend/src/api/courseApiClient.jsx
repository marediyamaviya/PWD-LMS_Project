import axios from "axios";

const courseApiClient = axios.create({
  baseURL: "http://localhost:9000/api/course/",
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
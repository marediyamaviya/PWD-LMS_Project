import axios from "axios";

const apiClient = axios.create({
  baseURL:  "http://localhost:8081",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
});

export default apiClient;
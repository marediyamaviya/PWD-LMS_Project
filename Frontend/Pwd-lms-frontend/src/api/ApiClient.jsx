import axios from "axios";

const apiClient = axios.create({
  baseURL:  "http://localhost:9000/api/identity/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
});

export default apiClient;
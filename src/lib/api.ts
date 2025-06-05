import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7134/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;
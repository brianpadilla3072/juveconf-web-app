import axios from "axios";

const api = axios.create({
  baseURL: process.env.SERVER_API || "http://localhost:3072",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
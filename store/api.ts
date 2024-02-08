import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.0.202:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

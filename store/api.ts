import axios from "axios";

export const ADDRESS = "10.0.0.202:8000";

const api = axios.create({
  baseURL: `http://${ADDRESS}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

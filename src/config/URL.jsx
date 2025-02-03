import axios from "axios";

const api = axios.create({
  baseURL: "https://sgitjobs.com/schoolCms/api/",
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("schoolCms_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;

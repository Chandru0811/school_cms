import axios from "axios";

const api = axios.create({
  // baseURL: "https://sgitjobs.com/school-cms/api/",
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("schoolCMS_token");

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

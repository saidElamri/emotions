import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8000", // Ensure this matches your backend port
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

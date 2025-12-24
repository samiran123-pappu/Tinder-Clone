// client/src/lib/axios.js
import axios from "axios";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

export const axiosInstance = axios.create({
  baseURL:BASE_URL,  // your backend API base
  withCredentials: true  // ← THIS IS THE FIX — sends cookies with every request
});
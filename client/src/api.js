import axios from "axios";
const API = axios.create({
  baseURL: "https://astu-lost-find-system.onrender.com/api",
});
export default API;

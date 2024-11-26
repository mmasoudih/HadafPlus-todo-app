import axios from "axios";

// Create an axios instance with predefined settings
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 20000,
});

// Export the request instance and todo functions
export * from "./todo";
export { request };

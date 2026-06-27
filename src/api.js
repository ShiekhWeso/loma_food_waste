// Central API base URL config
import API_URL from "./api";
// In development: http://localhost:5000
// In production: set REACT_APP_API_URL in your .env
const API_URL = process.env.REACT_APP_API_URL || `${API_URL}`;

export default API_URL;

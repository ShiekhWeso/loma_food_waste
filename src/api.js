// Central API base URL config
// In development: http://localhost:5000
// In production: set REACT_APP_API_URL in your .env
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default API_URL;
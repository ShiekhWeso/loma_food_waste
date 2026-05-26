
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import CustomerSignUpPage from './pages/CustomerSignUpPage';
import RestaurantSignUpPage from './pages/RestaurantSignUpPage';
import AuthSuccessPage from './pages/AuthSuccessPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RoleSelectionPage />} />
      <Route path="/signup/customer" element={<CustomerSignUpPage />} />
      <Route path="/signup/restaurant" element={<RestaurantSignUpPage />} />
      <Route path="/auth/success" element={<AuthSuccessPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

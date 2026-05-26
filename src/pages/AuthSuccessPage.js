import { Link, useLocation } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter';

function AuthSuccessPage() {
  const location = useLocation();
  const title = location.state?.title || 'Authentication complete.';
  const message = location.state?.message || "Your Lo'ma authentication flow is ready.";

  return (
    <div className="auth-shell auth-shell--login">
      <main className="success-main">
        <section className="success-card">
          <div className="success-icon">
            <span className="material-symbols-outlined">check</span>
          </div>
          <h1>{title}</h1>
          <p>{message}</p>
          <div className="success-actions">
            <Link className="primary-button" to="/login">
              Back to Login
            </Link>
            <Link className="secondary-button" to="/signup">
              Create another account
            </Link>
          </div>
        </section>
      </main>
      <AuthFooter />
    </div>
  );
}

export default AuthSuccessPage;

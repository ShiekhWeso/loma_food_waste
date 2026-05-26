import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter';

const rolePanelImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAW_AxB3vtJEfLHUyvrg9BL6uyKyQgcM32HtzWZAACJmfPvQNQboHfkkFAQRhWFu9aYYP0HO3RGexh-KuZSfbEAVmGTqSAaUeekfiWuloXWOceg7kd4z57Kb1GPisyL-qet6nw6b1BT9MA2d6Xch5yfgGYa1se4ck4Luf3dlrRzehTiqjX3a7yNUW0-a8jBwLXT5_rSGd2mP8lDXmPL4T_EbMWqOQZk9-A84qqt4mIAINNCr3_hUbMcFX4_4iTgl0jNEPGPMV0Un-0';

function RoleSelectionPage() {
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  function continueFlow() {
    navigate(role === 'customer' ? '/signup/customer' : '/signup/restaurant');
  }

  return (
    <div className="auth-shell role-shell">
      <main className="role-main">
        <section className="role-card">
          <div className="role-card__content">
            <div className="pill-tabs">
              <button className="pill-tabs__item active" type="button">
                Sign Up
              </button>
              <Link className="pill-tabs__item" to="/login">
                Login
              </Link>
            </div>

            <div className="role-heading">
              <h1>Choose your journey</h1>
              <p>Join people and restaurants working together to reduce food waste, one meal at a time.</p>
            </div>

            <div className="role-options">
              <RoleCard
                active={role === 'customer'}
                icon="restaurant_menu"
                title="Customer"
                description="Browse and buy discounted meals from local favorites. Eat well, spend less."
                badge="Eco Impact"
                badgeType="green"
                onClick={() => setRole('customer')}
              />
              <RoleCard
                active={role === 'restaurant'}
                icon="storefront"
                title="Restaurant"
                description="Sell surplus meals, reach new customers, and eliminate food waste losses."
                badge="Business Growth"
                badgeType="orange"
                onClick={() => setRole('restaurant')}
              />
            </div>

            <button className="primary-button" type="button" onClick={continueFlow}>
              Continue to Step 2
            </button>

            <p className="terms-line">
              By continuing, you agree to our <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>

          <div className="role-card__visual" aria-hidden="true">
            <img src={rolePanelImage} alt="" />
            <div>
              <span>Food Saving</span>
            </div>
          </div>
        </section>
      </main>
      <AuthFooter />
    </div>
  );
}

function RoleCard({ active, icon, title, description, badge, badgeType, onClick }) {
  return (
    <button className={active ? 'role-option active' : 'role-option'} type="button" onClick={onClick}>
      <span className={`role-option__icon role-option__icon--${badgeType}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </span>
      <span className="role-option__title">{title}</span>
      <span className="role-option__description">{description}</span>
      <span className={`role-option__badge role-option__badge--${badgeType}`}>{badge}</span>
      <span className="role-option__check">
        <span className="material-symbols-outlined">check</span>
      </span>
    </button>
  );
}

export default RoleSelectionPage;

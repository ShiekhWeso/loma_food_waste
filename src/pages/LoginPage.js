import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter';
import FormField from '../components/FormField';
import { authenticate } from '../utils/authStorage';
import { isEmail, validatePassword } from '../utils/validation';

const mealImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBwm5RhVam9oXbL-m2yc7nYQodMRv-FH9oUUg0vPlhFNgPgFeQ-zHLp-x1e-yieYJujUYwJj_yhkSBRSx8B2st1_aT4H6Fxs0L0pavHD8htAaQLZB4xRU7R8TbotfQYTp-kACK6EXj4LGL8pZpV0PIypc6aPbU_j4R3g-27-3_1jW9jJ8iRcpjSSRvZb7eLBTgkiQxa1ivyyqlr2d11ZcX2g59CvxniCuNGE4EF_1c-AW4387KfuCGAaisPPBgrdQdm0xp_8SKDtDI';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(location.state?.notice || '');
  const [loading, setLoading] = useState(false);

  const roleLabel = useMemo(() => (role === 'customer' ? 'Customer' : 'Restaurant'), [role]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', form: '' }));
    setStatus('');
  }

  function validate() {
    const nextErrors = {};
    if (!isEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      nextErrors.password = passwordError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitLogin(event) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    setStatus('');

    window.setTimeout(() => {
      try {
        const session = authenticate({ ...form, role });
        navigate('/auth/success', {
          state: {
            title: `Welcome back, ${session.name || session.restaurantName || roleLabel}.`,
            message: `You are signed in as ${roleLabel.toLowerCase()}.`,
          },
        });
      } catch (error) {
        setErrors({ form: error.message });
      } finally {
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div className="auth-shell auth-shell--login">
      <main className="login-main">
        <div className="auth-orb auth-orb--top" />
        <div className="auth-orb auth-orb--bottom" />
        <section className="login-wrap">
          <div className="brand-anchor">
            <h1>Lo&rsquo;ma</h1>
            <p>Save food. Eat better.</p>
          </div>

          <div className="login-card">
            <div className="auth-tabs auth-tabs--square">
              <button className="auth-tab auth-tab--active" type="button">
                Login
              </button>
              <Link className="auth-tab" to="/signup">
                Sign Up
              </Link>
            </div>

            <div className="login-card__body">
              <div className="identity-toggle" aria-label="Choose account type">
                <button
                  className={role === 'customer' ? 'identity-toggle__item active' : 'identity-toggle__item'}
                  type="button"
                  onClick={() => setRole('customer')}
                >
                  Customer
                </button>
                <button
                  className={role === 'restaurant' ? 'identity-toggle__item active' : 'identity-toggle__item'}
                  type="button"
                  onClick={() => setRole('restaurant')}
                >
                  Restaurant
                </button>
              </div>

              {status && <div className="auth-alert auth-alert--success">{status}</div>}
              {errors.form && <div className="auth-alert">{errors.form}</div>}

              <form className="auth-form" onSubmit={submitLogin} noValidate>
                <FormField
                  id="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="gourmet@example.com"
                  icon="mail"
                  error={errors.email}
                  autoComplete="email"
                />

                <div>
                  <div className="field-row">
                    <label className="form-field__label" htmlFor="password">
                      Password
                    </label>
                    <button
                      className="text-link text-link--small"
                      type="button"
                      onClick={() => setStatus('Password reset flow is ready for backend integration.')}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <FormField
                    id="password"
                    label=""
                    type="password"
                    value={form.password}
                    onChange={updateField}
                    placeholder="••••••••"
                    icon="lock"
                    error={errors.password}
                    autoComplete="current-password"
                  />
                </div>

                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Log In'}
                </button>
              </form>

              <div className="divider">
                <span>Or continue with</span>
              </div>

              <div className="social-grid">
                <button className="social-button" type="button" onClick={() => setStatus('Google login is ready for OAuth integration.')}>
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button className="social-button" type="button" onClick={() => setStatus('Apple login is ready for OAuth integration.')}>
                  <span className="material-symbols-outlined">ios</span>
                  <span>Apple</span>
                </button>
              </div>
            </div>

            <div className="promise-strip">
              By signing in, you agree to our <a href="/sustainability">Sustainability Promise</a>.
            </div>
          </div>

          <aside className="meal-callout">
            <div className="meal-callout__image">
              <img src={mealImage} alt="Vibrant healthy food bowl with fresh ingredients" />
            </div>
            <div>
              <h3>Every meal counts.</h3>
              <p>Join 15,000+ people saving surplus meals every day.</p>
            </div>
          </aside>
        </section>
      </main>
      <AuthFooter />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285f4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34a853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#fbbc05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#ea4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default LoginPage;

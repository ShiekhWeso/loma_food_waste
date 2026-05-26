import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter';
import FormField from '../components/FormField';
import { registerAccount } from '../utils/authStorage';
import { isEmail, required, validatePassword } from '../utils/validation';

const customerImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsa7WUvBWrkgUQFcxZAgOgptX_fLOybM0B04ZMjh5f6PZn_vJHE-95AS90_tinOZ5K5Ms3D9qvg7wwd-nBJmh4YLepan5yDHHhZnqFBluv_Ql9yUxixUiNLyuq04LOjvqgWlqnDnrOm_xlrAw4NdZY7I-UqsMouAlgdNdqKsNu4X79GUEG5O_bzF1IUQsU3Mmv3L8eqaEvzRg7d-Eift6dPkuXEsdThfPFjlTWcZ_4E6v0UQeIx14xWPSISV9A20R1oMx2Y5cA1dA';

function CustomerSignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', form: '' }));
  }

  function validate() {
    const nextErrors = {
      name: required(form.name, 'Full name is required.'),
      email: isEmail(form.email) ? '' : 'Enter a valid email address.',
      password: validatePassword(form.password),
      confirmPassword:
        form.confirmPassword === form.password ? '' : 'Passwords must match.',
    };

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) {
        delete nextErrors[key];
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitForm(event) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      try {
        registerAccount({ ...form, role: 'customer' });
        navigate('/auth/success', {
          state: {
            title: `Welcome, ${form.name}.`,
            message: 'Your customer account is ready to discover discounted meals.',
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
    <div className="auth-shell">
      <main className="signup-main">
        <section className="customer-card">
          <div className="customer-card__visual">
            <img src={customerImage} alt="Fresh vegetables and gourmet ingredients" />
            <div className="customer-card__overlay">
              <h2>Lo&rsquo;ma</h2>
              <p>Save surplus meals from local restaurants and enjoy better food for less.</p>
            </div>
          </div>

          <div className="signup-panel">
            <div className="signup-heading">
              <h1>Create Account</h1>
              <p>Start your sustainable culinary journey today.</p>
            </div>

            {errors.form && <div className="auth-alert">{errors.form}</div>}

            <form className="auth-form" onSubmit={submitForm} noValidate>
              <FormField
                id="name"
                label="Full Name"
                value={form.name}
                onChange={updateField}
                placeholder="John Doe"
                error={errors.name}
                autoComplete="name"
              />
              <FormField
                id="email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="john@example.com"
                error={errors.email}
                autoComplete="email"
              />
              <div className="form-grid">
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="••••••••"
                  error={errors.password}
                  autoComplete="new-password"
                />
                <FormField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
              </div>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>

            <div className="signup-links">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
              <Link className="back-link" to="/signup">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to role selection
              </Link>
            </div>
          </div>
        </section>
      </main>
      <AuthFooter compact />
    </div>
  );
}

export default CustomerSignUpPage;

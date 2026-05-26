import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter';
import FormField from '../components/FormField';
import { registerAccount } from '../utils/authStorage';
import { isEmail, required, validatePassword } from '../utils/validation';

const chefImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDxjkKyI4KzQA6p2EAcYTB-0RNhCi_rsK9wrVM1hDRHaqyVIWcZhr8ovTwM3xPqOjRovYJViRhgQ6650i3_1DRplnxAnFNqXDODAlCmf-4qFcDsirv_0Ldp5-BZY5a87yYfnSWxcTC61glBHalWX-keF_4utS-BEG-2FJTVfWweyjxqCs2_YKLWJ0nAHjEMcYLVvLKtEn8-6mv6Fgq0Fl6xXwhPPtQmcYjooiLzZBi_cFpOhyguBPIgvUKAg0NHhHw1J2xB5sZDJiE';

function RestaurantSignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    restaurantName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', form: '' }));
  }

  function validate() {
    const nextErrors = {
      restaurantName: required(form.restaurantName, 'Restaurant name is required.'),
      email: isEmail(form.email) ? '' : 'Enter a valid business email.',
      password: validatePassword(form.password),
      confirmPassword:
        form.confirmPassword === form.password ? '' : 'Passwords must match.',
      location: required(form.location, 'Location is required.'),
      category: required(form.category, 'Select a restaurant category.'),
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
        registerAccount({ ...form, role: 'restaurant' });
        navigate('/auth/success', {
          state: {
            title: `${form.restaurantName} is ready.`,
            message: 'Your restaurant account can now publish surplus meal offers.',
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
    <div className="auth-shell restaurant-shell">
      <main className="restaurant-main">
        <div className="auth-orb auth-orb--restaurant-top" />
        <div className="auth-orb auth-orb--restaurant-bottom" />
        <section className="restaurant-card">
          <aside className="restaurant-card__visual">
            <div>
              <h1>Lo&rsquo;ma</h1>
              <p>Restaurant Partners</p>
            </div>
            <div className="restaurant-story">
              <div className="chef-photo">
                <img src={chefImage} alt="Chef plating food" />
                <div className="impact-badge">
                  <span>Impact</span>
                  <strong>8k+ Meals Saved</strong>
                </div>
              </div>
              <div className="profit-card">
                <h2>Smart Waste Reduction</h2>
                <p>
                  Turn your surplus into opportunity. Join the curated network of restaurants
                  reducing waste without compromising on brand prestige.
                </p>
              </div>
            </div>
            <div className="partner-row">
              <div className="avatar-stack">
                <span>JD</span>
                <span>AS</span>
                <span>MK</span>
              </div>
              <p>Join 500+ premium kitchens</p>
            </div>
          </aside>

          <div className="restaurant-card__form">
            <div className="signup-heading">
              <h1>Create Account</h1>
              <p>Register your restaurant to start the journey.</p>
            </div>

            {errors.form && <div className="auth-alert">{errors.form}</div>}

            <form className="auth-form restaurant-form" onSubmit={submitForm} noValidate>
              <FormField
                id="restaurantName"
                label="Restaurant Name"
                value={form.restaurantName}
                onChange={updateField}
                placeholder="The Green Bistro"
                error={errors.restaurantName}
              />

              <div className="form-grid">
                <FormField
                  id="email"
                  label="Business Email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="chef@restaurant.com"
                  error={errors.email}
                  autoComplete="email"
                />
                <FormField
                  id="phone"
                  label="Phone (Optional)"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                />
              </div>

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
                  label="Confirm"
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
              </div>

              <FormField
                id="location"
                label="Location (City or Address)"
                value={form.location}
                onChange={updateField}
                placeholder="San Francisco, CA"
                icon="location_on"
                error={errors.location}
              />

              <div className="form-field">
                <label className="form-field__label" htmlFor="category">
                  Restaurant Category
                </label>
                <div className="form-field__control">
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className="form-field__input form-field__select"
                    aria-invalid={Boolean(errors.category)}
                  >
                    <option value="">Select category</option>
                    <option value="fine_dining">Fine Dining</option>
                    <option value="bakery">Artisanal Bakery</option>
                    <option value="casual">Casual Gourmet</option>
                    <option value="cafe">Eco Cafe</option>
                  </select>
                  <span className="material-symbols-outlined form-field__select-icon">expand_more</span>
                </div>
                {errors.category && <p className="form-field__error">{errors.category}</p>}
              </div>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Restaurant Account'}
              </button>
            </form>

            <div className="signup-links restaurant-links">
              <p>
                Already a partner? <Link to="/login">Login</Link>
              </p>
              <Link className="back-link muted" to="/signup">
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

export default RestaurantSignUpPage;

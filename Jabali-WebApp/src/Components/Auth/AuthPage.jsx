// src/Components/Auth/AuthPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChildOnboarding from '../Onboarding/ChildOnboarding';
import './Auth.css';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'parent',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { email, password, fullName, userType } = formData;
    const isRegister = !isSignIn;

    const result = await login(email, password, userType, fullName, isRegister);

    setSubmitting(false);

    if (result.success) {
      if (isRegister) {
        setIsOnboarding(true);
      } else {
        navigate('/app');
      }
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const features = [
    { icon: '🧒', text: 'Personalised child profiles' },
    { icon: '📚', text: 'Interactive learning modules' },
    { icon: '🎵', text: 'Calming music therapy' },
    { icon: '🎮', text: 'Sensory-friendly games' },
    { icon: '📊', text: 'Progress tracking dashboard' },
  ];

  if (isOnboarding) {
    return <ChildOnboarding onComplete={() => navigate('/app')} />;
  }

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel-left">
        <div className="auth-logo-area">
          <div className="auth-logo">J</div>
          <h1 className="auth-brand-title">Jabali</h1>
          <p className="auth-brand-subtitle">
            A safe, inclusive learning platform built with love for autistic
            children and their caregivers.
          </p>
        </div>

        <div className="auth-features">
          {features.map((f, i) => (
            <div key={i} className="auth-feature">
              <div className="auth-feature-icon">{f.icon}</div>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>{isSignIn ? 'Welcome back 👋' : 'Create your account'}</h2>
            <p>
              {isSignIn
                ? 'Sign in to continue your journey on Jabali'
                : 'Join thousands of families supporting their children'}
            </p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`tab ${isSignIn ? 'active' : ''}`}
              onClick={() => { setIsSignIn(true); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab ${!isSignIn ? 'active' : ''}`}
              onClick={() => { setIsSignIn(false); setError(''); }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            {!isSignIn && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required={!isSignIn}
                  />
                </div>

                <div className="form-group">
                  <label>I am a…</label>
                  <div className="role-buttons">
                    <button
                      type="button"
                      className={`role-btn ${formData.userType === 'parent' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, userType: 'parent' })}
                    >
                      👨‍👩‍👧 Parent
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${formData.userType === 'caregiver' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, userType: 'caregiver' })}
                    >
                      🤝 Caregiver
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isSignIn ? 'Your password' : 'Create a secure password'}
                required
                disabled={submitting}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Please wait...' : (isSignIn ? '→ Sign In' : '→ Create Account')}
            </button>

            {isSignIn && (
              <div className="forgot-password">
                <a href="#reset">Forgot your password?</a>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

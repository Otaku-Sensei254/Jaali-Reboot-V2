import React, { useState } from "react";
import "./Auth.css";

const SignUpForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "parent"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (selectedRole) => {
    setFormData({
      ...formData,
      role: selectedRole
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.role);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="signupEmail" className="form-label">Email Address</label>
        <input
          id="signupEmail"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="signupPassword" className="form-label">Password</label>
        <input
          id="signupPassword"
          name="password"
          type="password"
          placeholder="Create a secure password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">I am a...</label>
        <div className="role-selector">
          <button
            type="button"
            className={`role-option ${formData.role === "parent" ? "selected" : ""}`}
            onClick={() => handleRoleChange("parent")}
          >
            Parent
          </button>
          <button
            type="button"
            className={`role-option ${formData.role === "caregiver" ? "selected" : ""}`}
            onClick={() => handleRoleChange("caregiver")}
          >
            Caregiver
          </button>
        </div>
      </div>

      <button type="submit" className="auth-btn primary-btn">Create Account</button>
    </form>
  );
};

export default SignUpForm;
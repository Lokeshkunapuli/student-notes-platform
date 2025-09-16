import React, { useState } from "react";
import { signup as apiSignup } from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";

// API base and axios instance are managed in services/api.js

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiSignup(form.name, form.email, form.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <section className="card">
        <h2>Sign up</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="Name" name="name" value={form.name} onChange={onChange} required />
          <input className="input" placeholder="Email" name="email" type="email" value={form.email} onChange={onChange} required />
          <input className="input" placeholder="Password" name="password" type="password" value={form.password} onChange={onChange} required />
          <button className="button" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
          {error && <span className="muted" style={{ color: "#ef4444" }}>{error}</span>}
        </form>
        <p className="muted" style={{ marginTop: 10 }}>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
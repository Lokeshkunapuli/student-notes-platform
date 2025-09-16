import React, { useState } from "react";
import { login as apiLogin } from "../services/api.js";
import { useLocation, useNavigate, Link } from "react-router-dom";

// API base and axios instance are managed in services/api.js

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiLogin(form.email, form.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <section className="card">
        <h2>Login</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input className="input" placeholder="Email" name="email" type="email" value={form.email} onChange={onChange} required />
          <input className="input" placeholder="Password" name="password" type="password" value={form.password} onChange={onChange} required />
          <button className="button" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          {error && <span className="muted" style={{ color: "#ef4444" }}>{error}</span>}
        </form>
        <p className="muted" style={{ marginTop: 10 }}>
          No account? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </div>
  );
}
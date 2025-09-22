import React, { useState } from "react";
import API from "../utils/api";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import { saveAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      saveAuth(res.data.token, res.data.user);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        <form onSubmit={submit} className="space-y-3">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button type="submit">{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
      </div>
    </Container>
  );
}

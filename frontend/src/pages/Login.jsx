import React, { useState } from "react";
import API from "../utils/api";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import { saveAuth } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

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
      console.error(err);
      setError(
        err?.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="flex min-h-[calc(100vh-80px)] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Welcome back
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
            Log in to CampusConnect
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Continue discovering what&apos;s happening around your campus.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
            {error && (
              <div className="text-xs text-red-400">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-accent hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

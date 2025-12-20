import React, { useState } from "react";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import API from "../utils/api";
import { saveAuth } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/register", form);
      saveAuth(res.data.token, res.data.user);
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Unable to create account. Please try again."
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
            Join the campus network
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
            Create your account
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Share posts, events, and opportunities with your college.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40">
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
            <Input
              label="College email"
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
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

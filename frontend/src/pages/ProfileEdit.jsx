import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import API, { uploadFile } from "../utils/api";
import useAuth from "../hooks/useAuth";
import { saveAuth } from "../utils/auth";

export default function ProfileEdit() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    college: "",
    year: "",
    skills: [],
    avatarUrl: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      college: user.college || "",
      year: user.year || "",
      skills: Array.isArray(user.skills) ? user.skills : [],
      avatarUrl: user.avatarUrl || "",
    });
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = form.avatarUrl || "";

      if (avatar) {
        const data = await uploadFile(avatar);
        avatarUrl = data.url || data.filename || avatarUrl;
      }

      const res = await API.put("/users/me", { ...form, avatarUrl });
      const updatedUser = res.data;

      saveAuth(localStorage.getItem("cc_token"), updatedUser);
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <Container className="py-10">
        <p className="text-sm text-slate-200">
          You must be logged in to edit your profile.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Profile
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
          Edit your profile
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          This information will be visible to others on CampusConnect.
        </p>
      </div>

      <div className="max-w-xl rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40">
        <form onSubmit={submit} className="space-y-4 text-sm">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
          <Input
            label="College"
            value={form.college}
            onChange={(e) =>
              setForm({ ...form, college: e.target.value })
            }
          />
          <Input
            label="Year"
            placeholder="e.g. 2nd year, 2026 batch"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value })
            }
          />
          <Input
            label="Skills"
            hint="Comma-separated (e.g. C++, React, UI Design)"
            value={(form.skills || []).join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                skills: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
          <div className="text-sm">
            <div className="mb-1 font-medium text-slate-100">
              Avatar
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
            />
            {form.avatarUrl && (
              <p className="mt-1 text-xs text-slate-500">
                Current avatar:{" "}
                <span className="break-all">{form.avatarUrl}</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full justify-center"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </Container>
  );
}

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
    if (user) {
      setForm({
        ...user,
        skills: Array.isArray(user.skills) ? user.skills : [], // always array
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = form.avatarUrl || "";
      if (avatar) {
        const data = await uploadFile(avatar);
        avatarUrl = data.filename;
      }
      const res = await API.put("/users/me", { ...form, avatarUrl });
      saveAuth(localStorage.getItem("cc_token"), res.data);
      setUser(res.data);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={submit} className="space-y-4 max-w-md">
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="College"
          value={form.college}
          onChange={(e) => setForm({ ...form, college: e.target.value })}
        />
        <Input
          label="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />
        <Input
          label="Skills (comma separated)"
          value={(form.skills || []).join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              skills: e.target.value.split(",").map((s) => s.trim()),
            })
          }
        />
        <Input
          label="Avatar"
          type="file"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Container>
  );
}

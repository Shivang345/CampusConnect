import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Card from "../components/Card";
import API from "../utils/api";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (!user) return;
    API.get("/users/me")
      .then((res) => setMe(res.data))
      .catch((err) => {
        console.error("Failed to load profile", err);
      });
  }, [user]);

  if (!user) {
    return (
      <Container className="py-10">
        <Card className="bg-slate-900/80 border-slate-700/70 text-slate-100">
          <h1 className="text-xl font-semibold tracking-tight">
            You&apos;re not logged in
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Log in to view your profile, skills, and activity.
          </p>
          <div className="mt-4 flex gap-3 text-sm">
            <Link
              to="/login"
              className="rounded-full bg-accent px-4 py-2 text-white hover:bg-accent/90"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-slate-600 px-4 py-2 text-slate-200 hover:bg-slate-800"
            >
              Create account
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Profile
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
            Your campus identity
          </h1>
        </div>
        <Link
          to="/profile/edit"
          className="rounded-full border border-slate-700/80 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          Edit profile
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
        {/* Left: main info */}
        <Card className="bg-slate-900/80 border-slate-700/70 text-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                <img
                  src={
                    me?.avatarUrl ||
                    "https://via.placeholder.com/80?text=CC"
                  }
                  alt={me?.name || "Avatar"}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold tracking-tight">
                {me?.name || user?.name || "Your name"}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {me?.college || "Your college"}
                {me?.year ? ` • ${me.year}` : ""}
              </p>
              <p className="mt-2 text-xs text-slate-400 max-w-md">
                Keep your profile updated so people know who you are and
                what you&apos;re working on.
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-800/80 pt-4">
            <h3 className="text-sm font-semibold text-slate-100">
              Skills
            </h3>
            {me?.skills && me.skills.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {me.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                You haven&apos;t added any skills yet. Use the edit button
                to add things you&apos;re good at or currently learning.
              </p>
            )}
          </div>
        </Card>

        {/* Right: small meta / actions */}
        <Card className="bg-slate-900/80 border-slate-700/70 text-slate-100">
          <h3 className="text-sm font-semibold">Profile snapshot</h3>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p>
              <span className="text-slate-500">Email:</span>{" "}
              {user?.email}
            </p>
            <p>
              <span className="text-slate-500">College:</span>{" "}
              {me?.college || "Not set"}
            </p>
            <p>
              <span className="text-slate-500">Year:</span>{" "}
              {me?.year || "Not set"}
            </p>
            <p>
              <span className="text-slate-500">Skills count:</span>{" "}
              {me?.skills?.length || 0}
            </p>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <Link
              to="/create-post"
              className="block rounded-full bg-accent px-4 py-2 text-center font-medium text-white hover:bg-accent/90"
            >
              Share something with your campus
            </Link>
            <Link
              to="/"
              className="block text-center text-slate-400 hover:text-slate-200 hover:underline"
            >
              Back to feed
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  );
}

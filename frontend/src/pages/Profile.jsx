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
      .catch(() => {});
  }, [user]);

  if (!user)
    return (
      <Container className="py-12">
        <Card>
          Please{" "}
          <a href="/login" className="text-blue-600">
            login
          </a>{" "}
          to view profile.
        </Card>
      </Container>
    );

  return (
    <Container className="py-8">
      <div className="max-w-xl mx-auto">
        <Card>
          <div className="flex items-center gap-4">
            <img
              src={me?.avatarUrl || "https://via.placeholder.com/80"}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <div className="text-xl font-semibold">{me?.name}</div>
              <div className="text-sm text-gray-500">
                {me?.college} • {me?.year}
              </div>
              <Link to="/profile/edit" className="text-sm text-accent">
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium">Skills</h4>
            <div className="flex gap-2 flex-wrap mt-2">
              {(me?.skills || []).map((s) => (
                <div key={s} className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}

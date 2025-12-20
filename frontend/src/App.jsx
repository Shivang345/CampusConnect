import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import ProfileEdit from "./pages/ProfileEdit";
import EditPost from "./pages/EditPost";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {/* soft glow background */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(79,70,229,0.18),_transparent_60%)]" />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 py-6 sm:py-8">
            <div className="px-3 sm:px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

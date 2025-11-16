// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";
import { motion } from "framer-motion";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function logout() {
    clearAuth();
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav className="backdrop-blur-sm bg-white/70 border-b sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.9, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold"
            >
              CC
            </motion.div>
            <span className="font-semibold text-lg">CampusConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm hover:text-blue-600 transition">Home</Link>
            <Link to="/profile" className="text-sm hover:text-blue-600 transition">Profile</Link>
            {user ? (
              <button onClick={logout} className="text-sm hover:text-red-500 transition">Logout</button>
            ) : (
              <Link to="/login" className="text-sm hover:text-blue-600 transition">Login</Link>
            )}
          </div>

          {/* mobile */}
          <div className="md:hidden">
            <button
              aria-label="menu"
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* simple mobile dropdown */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className={`overflow-hidden md:hidden`}
      >
        <div className="px-4 pb-4 space-y-2">
          <Link to="/" className="block text-sm">Home</Link>
          <Link to="/profile" className="block text-sm">Profile</Link>
          {user ? (
            <button onClick={logout} className="block text-left w-full text-sm">Logout</button>
          ) : (
            <Link to="/login" className="block text-sm">Login</Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
}

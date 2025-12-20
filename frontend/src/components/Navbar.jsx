// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";
import { motion, AnimatePresence } from "framer-motion";

const navLinkClasses = ({ isActive }) =>
  `px-3 py-1 rounded-full text-sm font-medium transition ${
    isActive
      ? "bg-accent/10 text-accent"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials =
    (user?.name && user.name[0]) ||
    (user?.email && user.email[0]) ||
    "C";

  function logout() {
    clearAuth();
    navigate("/login");
    window.location.reload();
  }

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-lg"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10">
            <span className="text-lg font-semibold text-accent">CC</span>
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              CampusConnect
            </p>
            <p className="text-xs text-slate-500">
              Share events, skills & updates
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 sm:flex">
          <div className="flex items-center gap-1">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            {user && (
              <>
                <NavLink to="/create-post" className={navLinkClasses}>
                  Create
                </NavLink>
                <NavLink to="/profile" className={navLinkClasses}>
                  Profile
                </NavLink>
              </>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right text-xs leading-tight md:block">
                <p className="max-w-[160px] truncate font-medium text-slate-900">
                  {user.name || user.email}
                </p>
                {user.college && (
                  <p className="max-w-[160px] truncate text-slate-500">
                    {user.college}
                  </p>
                )}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-indigo-500 text-sm font-semibold text-white shadow-sm">
                {initials.toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="text-xs font-medium text-slate-500 transition hover:text-red-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/login"
                className="font-medium text-slate-600 hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: avatar + menu */}
        <div className="flex items-center gap-3 sm:hidden">
          {user && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-indigo-500 text-xs font-semibold text-white shadow-sm">
              {initials.toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/80 bg-white/80 text-slate-700 shadow-sm"
            aria-label="Toggle navigation"
          >
            <motion.span
              key={open ? "close" : "menu"}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg leading-none"
            >
              {open ? "×" : "≡"}
            </motion.span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-slate-200 bg-white/95 backdrop-blur-sm sm:hidden"
          >
            <div className="mx-auto max-w-5xl space-y-1 px-4 py-3 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>

              {user && (
                <>
                  <NavLink
                    to="/create-post"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    Create post
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </NavLink>
                </>
              )}

              <div className="mt-2 border-t border-slate-200/70 pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="block w-full rounded-md px-3 py-2 text-left text-slate-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="mt-1 block rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

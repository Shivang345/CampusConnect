import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  function logout() {
    clearAuth();
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-semibold text-lg">CampusConnect</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm">
              Home
            </Link>
            {!user && (
              <Link to="/login" className="text-sm">
                Login
              </Link>
            )}
            {!user && (
              <Link to="/register" className="text-sm">
                Register
              </Link>
            )}
            {user && (
              <>
                <Link to="/profile" className="text-sm">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

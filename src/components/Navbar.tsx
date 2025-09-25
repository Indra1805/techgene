"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { loggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Techgene
        </Link>

        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </li>
          <li>
            <Link href="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </li>

          {loggedIn === null ? (
            // Loading state while checking auth
            <li className="text-gray-500">...</li>
          ) : loggedIn ? (
            // Logged in → show Logout button
            <li>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </li>
          ) : (
            // Not logged in → show Get Started + Login
            <>
              <li>
                <Link
                  href="/otp"
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

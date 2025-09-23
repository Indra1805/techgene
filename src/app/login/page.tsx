"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) setUserId(storedUserId);
    else setMessage("User ID not found. Please verify OTP first.");
  }, []);

  const handleLogin = async () => {
    if (!/^\d{6}$/.test(passcode)) return setMessage("Enter a valid 6-digit passcode");
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/login-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, passcode_hash: passcode }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) router.push("/courses");
      else setMessage(data.error || "Incorrect passcode");
    } catch (err: unknown) {
      setLoading(false);
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Login with Your Passcode</h1>
      <input
        type="password"
        placeholder="Enter 6-digit passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-full max-w-xs text-center"
        maxLength={6}
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
    </div>
  );
}

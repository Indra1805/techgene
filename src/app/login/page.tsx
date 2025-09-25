"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedCode, setSelectedCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    if (!phone.match(/^\d+$/)) return setMessage("Enter a valid phone number");
    if (!/^\d{6}$/.test(passcode)) return setMessage("Enter a valid 6-digit passcode");

    const fullPhone = `${selectedCode}${phone}`;
    setLoading(true);

    try {
      const res = await fetch("/api/login-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ensure cookie is handled by browser
        body: JSON.stringify({ phone: fullPhone, passcode }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        // Notify AuthContext to re-check /api/me (cookie was set by server)
        login();
        router.push("/courses");
      } else {
        setMessage(data.error || "Incorrect phone or passcode");
      }
    } catch (err: unknown) {
      setLoading(false);
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Login with Your Passcode</h1>

      <div className="flex mb-4 w-full max-w-xs">
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="border rounded-l px-2 py-2 bg-white"
        >
          {countryCodes.map((c) => (
            <option key={c.code} value={c.code}>
              {c.country} ({c.code})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="border rounded-r px-4 py-2 flex-1"
        />
      </div>

      <input
        type="password"
        placeholder="6-digit passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
        className="border rounded px-4 py-2 mb-4 w-full max-w-xs text-center"
        maxLength={6}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`px-6 py-2 rounded text-white w-full max-w-xs ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
    </div>
  );
}

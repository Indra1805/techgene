"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePasscodePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get("phone");
    if (!phoneParam) setMessage("Phone missing. Go back and verify OTP again.");
    else setPhone(phoneParam);
  }, []);

  const handleCreatePasscode = async () => {
    if (!/^\d{6}$/.test(passcode)) return setMessage("Passcode must be 6 digits");
    if (passcode !== confirmPasscode) return setMessage("Passcodes do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/create-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, passcode }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) router.push("/login");
      else setMessage(data.error || "Failed to create passcode");
    } catch (err: unknown) {
      setLoading(false);
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Your 6-digit Passcode</h1>
      <input
        type="password"
        placeholder="Enter passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        className="border rounded px-4 py-2 mb-2 w-full max-w-xs text-center"
        maxLength={6}
      />
      <input
        type="password"
        placeholder="Confirm passcode"
        value={confirmPasscode}
        onChange={(e) => setConfirmPasscode(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-full max-w-xs text-center"
        maxLength={6}
      />
      <button
        onClick={handleCreatePasscode}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "Saving..." : "Create Passcode"}
      </button>
      {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
    </div>
  );
}

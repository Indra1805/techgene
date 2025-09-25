"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePasscodePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPhone(params.get("phone") || "");
  }, []);

  const handleCreate = async () => {
    if (passcode.length !== 6) return setMessage("Enter 6-digit passcode");
    setLoading(true);

    try {
      const res = await fetch("/api/create-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, passcode }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.push("/login");
      } else {
        setMessage(data.error || "Error");
      }
    } catch {
      setLoading(false);
      setMessage("Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Set a 6-digit passcode</h1>
      <input
        type="password"
        maxLength={6}
        placeholder="******"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        className="border rounded px-4 py-2 mb-4 text-center"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "Save Passcode"}
      </button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

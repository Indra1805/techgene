"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Get phone param safely on client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get("phone") || "";
    setPhone(phoneParam);
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, token: otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.push(`/create-passcode?user_id=${encodeURIComponent(data.user.id)}`);
      } else {
        setMessage(data.error || "Invalid OTP");
      }
    } catch (err: unknown) {
      setLoading(false);
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Enter OTP sent to {phone || "your phone"}
      </h1>
      <input
        type="text"
        placeholder="6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-full max-w-xs text-center"
      />
      <button
        onClick={handleVerifyOTP}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

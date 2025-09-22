"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Enter the OTP");
      return;
    }

    setLoading(true);
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
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Enter OTP sent to {phone}</h1>
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
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

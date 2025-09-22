"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OTPPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!phone) return setMessage("Enter a valid phone number");

    setLoading(true);
    let data;
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      // Make sure res is valid JSON
      data = await res.json();
    } catch (err) {
      setLoading(false);
      setMessage("Failed to send OTP. Please try again.");
      return;
    }

    setLoading(false);
    if (data.success) {
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } else {
      setMessage(data.error || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Enter Your Phone Number</h1>
      <input
        type="text"
        placeholder="+911234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-full max-w-xs"
      />
      <button
        onClick={handleSendOTP}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

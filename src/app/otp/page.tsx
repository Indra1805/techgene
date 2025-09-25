"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OTPPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    if (!phone) return setMessage("Enter phone number");

    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `${countryCode}${phone}` }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.push(`/verify-otp?phone=${encodeURIComponent(countryCode + phone)}`);
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch {
      setLoading(false);
      setMessage("Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Enter your phone number</h1>
      <div className="flex mb-4">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="border rounded-l px-2 py-2"
        >
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          {/* add more */}
        </select>
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded-r px-4 py-2 w-48"
        />
      </div>
      <button
        onClick={handleSendOTP}
        disabled={loading}
        className={`px-6 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

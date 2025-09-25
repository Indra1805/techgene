"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const countryCodes = [
  { code: "+91", country: "IN" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
];

export default function OTPPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.match(/^\d+$/)) return setMessage("Enter a valid phone number");

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
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="border rounded-l px-2 py-2"
        >
          {countryCodes.map(c => <option key={c.code} value={c.code}>{c.country} ({c.code})</option>)}
        </select>
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="border rounded-r px-4 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

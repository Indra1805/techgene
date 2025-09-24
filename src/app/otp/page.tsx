"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  // Add more countries as needed
];

export default function SendOTPPage() {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone.match(/^\d+$/)) return setMessage("Enter a valid phone number");

    const fullPhone = `${selectedCode}${phone}`;
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.push(`/verify-otp?phone=${encodeURIComponent(fullPhone)}`);
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (err: unknown) {
      setLoading(false);
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Enter Your Phone Number</h1>

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

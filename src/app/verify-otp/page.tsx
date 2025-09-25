"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get("phone");
    if (!phoneParam) setMessage("Phone number missing.");
    else setPhone(phoneParam);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.match(/^\d{6}$/)) return setMessage("Enter a valid 6-digit OTP");

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
        router.push(`/create-passcode?phone=${encodeURIComponent(phone)}`);
      } else {
        setMessage(data.error || "Invalid OTP");
      }
    } catch {
      setLoading(false);
      setMessage("Unexpected error");
    }
  };

  // ✅ Submit form when Enter is pressed anywhere
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Enter OTP sent to {phone}</h1>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-4 items-center">
        <input
          type="text"
          name="otp"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          className="border rounded px-4 py-2 text-center"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

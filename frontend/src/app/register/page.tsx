"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

function isTokenValid(token?: string | null) {
  if (!token) return false;
  try {
    const base64 = token.split(".")[1];
    if (!base64) return false;
    const b64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(json);
    if (payload.exp && typeof payload.exp === "number") {
      return payload.exp * 1000 > Date.now();
    }
    return false;
  } catch {
    return false;
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) return;
    if (isTokenValid(token)) {
      router.replace("/orders");
    } else {
      localStorage.removeItem("access_token");
    }
  }, [router]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        data: { username, password },
      });

      const loginRes = await apiRequest<{ access_token: string }>("/auth/login", {
        method: "POST",
        data: { username, password },
      });

      const token = loginRes?.access_token;
      if (!token) {
        setMessage("Registered but auto-login failed. Please log in.");
        setLoading(false);
        return;
      }

      localStorage.setItem("access_token", token);
      router.replace("/orders");
    } catch (err: any) {
      setMessage(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 chars)"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

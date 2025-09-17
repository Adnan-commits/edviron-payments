"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // check if a token exists in localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/orders"); // redirect to orders page
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Edviron Payments</h1>
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </Link>
        <Link
          href="/orders"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Orders
        </Link>
      </div>
    </div>
  );
}

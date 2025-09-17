"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setLoggedIn(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    setLoggedIn(false);
    router.replace("/login");
  }

  return (
    <header className="bg-gray-800 text-white py-3 px-6 flex justify-between items-center shadow-md">
      <Link href="/" className="text-lg font-bold hover:text-gray-300">
        Edviron Payments
      </Link>
      {loggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </header>
  );
}

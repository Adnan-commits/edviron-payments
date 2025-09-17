// frontend/src/app/payment-status/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Link from "next/link";

interface Transaction {
  _id: string;
  orderId: string;
  amount: number;
  status: string;
  paymentId: string;
}

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setError("No transaction ID found in the URL");
      setLoading(false);
      return;
    }

    async function fetchTransaction() {
      try {
        const res = await apiRequest<Transaction>(`/transactions/${transactionId}`, {
          method: "GET",
        });
        setTransaction(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [transactionId]);

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Payment Status</h1>
        {transaction ? (
          <>
            <p className="mb-2 text-gray-700">
              <strong>Order ID:</strong> {transaction.orderId}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Amount:</strong> ₹{transaction.amount}
            </p>
            <p
              className={`text-lg font-semibold ${
                transaction.status === "SUCCESS"
                  ? "text-green-600"
                  : transaction.status === "FAILED"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              Status: {transaction.status}
            </p>
          </>
        ) : (
          <p>No transaction found.</p>
        )}

        {/* ✅ Back to Orders */}
        <Link
          href="/orders"
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Orders
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiRequest, getAuthHeaders } from "@/lib/api";

interface Order {
  _id: string;
  amount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [amount, setAmount] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchOrders() {
    try {
      const res = await apiRequest<Order[]>("/orders", {
        method: "GET",
        headers: { ...getAuthHeaders() },
      });
      setOrders(res);
    } catch (err: any) {
      console.error("Error fetching orders:", err.message);
      setMessage(err.message);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const newOrder = await apiRequest<Order>("/orders", {
        method: "POST",
        headers: { ...getAuthHeaders() },
        data: { amount: Number(amount) },
      });

      setOrders((prev) => [newOrder, ...prev]);
      setAmount("");

      const paymentRes = await apiRequest<{
        paymentUrl?: string;
        paymentStatusUrl?: string;
      }>("/payments/create", {
        method: "POST",
        headers: { ...getAuthHeaders() },
        data: { orderId: newOrder._id, amount: newOrder.amount },
      });

      if (paymentRes.paymentUrl) {
        window.location.href = paymentRes.paymentUrl;
        return;
      } else if (paymentRes.paymentStatusUrl) {
        window.location.href = paymentRes.paymentStatusUrl;
        return;
      }

      setMessage("Payment created but no redirect URL returned.");
    } catch (err: any) {
      setMessage(err.message || "Failed to create order/payment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        </div>

        {/* Order form */}
        <form
          onSubmit={handleCreateAndPay}
          className="bg-gray-50 p-6 rounded-lg border mb-8 shadow-sm"
        >
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter Amount
          </label>
          <input
            type="number"
            min="1"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Create Order & Pay"}
          </button>
          {message && (
            <p className="mt-3 text-sm text-red-600 font-medium">{message}</p>
          )}
        </form>

        {/* Orders list */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Your Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li
                  key={o._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border hover:bg-blue-50 hover:shadow-md transition"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      Order: {o._id}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-gray-700">
                    ₹{o.amount}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

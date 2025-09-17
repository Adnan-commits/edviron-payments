// src/lib/api.ts
import axios, { AxiosRequestConfig } from "axios";

// Create Axios instance with base URL from env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Function to get auth headers (JWT)
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Generic API request function
export async function apiRequest<T = any>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const res = await api.request<T>({
      url: path,
      method: options.method || "GET",
      data: options.data || undefined,   // 👈 ensures body is passed
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      throw new Error(
        err.response.data?.message || `API Error: ${err.response.status}`
      );
    } else {
      throw new Error(err.message || "Network Error");
    }
  }
}

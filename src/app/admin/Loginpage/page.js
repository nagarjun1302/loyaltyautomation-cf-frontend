"use client";

import axios from "axios";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isFrontendAdminAuthenticated, setFrontendAuth } from "../../lib/frontendAuth";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isFrontendAdminAuthenticated()) router.replace("/admin/Dasboard");
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5005/api/login", user, { withCredentials: true });
      if (response.data.role === "admin") {
        setFrontendAuth(response.data.token);
        router.push("/admin/Dasboard");
      }
      setUser({ email: "", password: "" });
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="industrial-grid flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-md border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <img
            src="/logo123.png"
            alt="Loyalty Automation"
            className="mx-auto h-12"
          />
          <h2 className="mt-6 text-3xl font-black text-slate-950">
            Admin Login
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email
            </label>
            <div className="flex h-12 items-center rounded-md border border-slate-200 bg-slate-50 px-3">
              <Mail className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={(event) =>
                  setUser({ ...user, email: event.target.value })
                }
                className="focus-ring w-full bg-transparent text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Password
            </label>
            <div className="flex h-12 items-center rounded-md border border-slate-200 bg-slate-50 px-3">
              <Lock className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={(event) =>
                  setUser({ ...user, password: event.target.value })
                }
                className="focus-ring w-full bg-transparent text-slate-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring h-12 rounded-md bg-teal-700 font-black text-white hover:bg-teal-800 disabled:bg-slate-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

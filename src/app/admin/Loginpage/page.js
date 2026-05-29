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
      const response = await axios.post("https://server.loyaltyautomation.com/api/login", user, { withCredentials: true });
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
    <div className="industrial-grid grid min-h-screen place-items-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-md border border-white/10 bg-white shadow-2xl lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="bg-slate-950 p-8 text-white">
          <img src="/logo123.png" alt="Loyalty Automation" className="mb-10 h-12 brightness-0 invert" />
          <p className="text-xs font-black uppercase tracking-wide text-amber-300">Admin Console</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">Control your industrial catalog with cleaner workflows.</h1>
          <p className="mt-4 leading-7 text-slate-300">Manage products, specs, brochures, company data and customer inquiries from a modern responsive dashboard.</p>
        </aside>

        <main className="p-6 sm:p-10">
          <h2 className="text-3xl font-black text-slate-950">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-500">Use your existing backend authentication.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            {errorMessage && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{errorMessage}</div>}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
              <div className="flex h-12 items-center rounded-md border border-slate-200 bg-slate-50 px-3">
                <Mail className="mr-3 h-5 w-5 text-slate-400" />
                <input type="email" name="email" value={user.email} onChange={(event) => setUser({ ...user, email: event.target.value })} className="focus-ring w-full bg-transparent text-slate-900" required />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
              <div className="flex h-12 items-center rounded-md border border-slate-200 bg-slate-50 px-3">
                <Lock className="mr-3 h-5 w-5 text-slate-400" />
                <input type="password" name="password" value={user.password} onChange={(event) => setUser({ ...user, password: event.target.value })} className="focus-ring w-full bg-transparent text-slate-900" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="focus-ring h-12 rounded-md bg-teal-700 font-black text-white hover:bg-teal-800 disabled:bg-slate-400">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

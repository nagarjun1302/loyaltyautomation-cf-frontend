"use client";

import { LogOut, BarChart3, Building2, ClipboardList, FileText, Gauge, ListTree, PackagePlus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearFrontendAuth, isFrontendAdminAuthenticated } from "../lib/frontendAuth";

const navItems = [
  { label: "Dashboard", href: "/admin/Dasboard", icon: Gauge },
  { label: "Add Product", href: "/admin/Addproduct", icon: PackagePlus },
  { label: "Products", href: "/admin/Getproduct", icon: ShoppingBag },
  { label: "Categories & Brands", href: "/admin/CatalogOptions", icon: ListTree },
  { label: "Enquiries", href: "/admin/Enquiry", icon: ClipboardList },
  { label: "Company Info", href: "/admin/CompanyInfo", icon: Building2 },
  { label: "About Us", href: "/admin/AboutUs", icon: FileText },
];

export default function AdminShell({ title, subtitle, children, actions }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isFrontendAdminAuthenticated()) {
      router.replace("/admin/Loginpage");
      return;
    }

    setAuthChecked(true);
  }, [router]);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    setLoggingOut(true);

    try {
      await axios.post("https://server.loyaltyautomation.com/api/logout", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      Cookies.remove("token");
      Cookies.remove("token", { path: "/" });
      clearFrontendAuth();
      setLoggingOut(false);
      router.replace("/admin/Loginpage");
    }
  };

  if (!authChecked) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 px-4 text-center text-sm font-bold text-slate-500">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 flex-col border-r border-slate-200 bg-slate-950 p-5 text-white lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <img src="/logo123.png" alt="Loyalty Automation" className="h-10 brightness-0 invert" />
          <div>
            {/* <p className="text-sm font-black uppercase tracking-wide">Loyalty Admin</p> */}
             {/* <p className="text-xs text-slate-400">Industrial catalog CMS</p> */}
          </div>
        </Link>
        <nav className="grid gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white">
                <Icon className="h-5 w-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-auto flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-5 w-5" />
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-18 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Admin Console</p>
              <h1 className="text-2xl font-black text-slate-950">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {actions}
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">{item.label}</Link>
            ))}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="whitespace-nowrap rounded-md border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminStat({ label, value, detail }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-800">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="text-2xl font-black text-slate-950">{value}</p>
        </div>
      </div>
      {detail && <p className="mt-4 text-sm text-slate-500">{detail}</p>}
    </div>
  );
}

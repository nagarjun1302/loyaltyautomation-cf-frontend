"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/customer/customervisit");
  }, [router]);

  return <div className="min-h-screen bg-slate-50 p-8 text-center font-bold text-slate-600">Redirecting to product catalog...</div>;
}

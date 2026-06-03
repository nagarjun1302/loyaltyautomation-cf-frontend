"use client";

import { Wrench } from "lucide-react";
import { useState } from "react";
import { CustomerNavbar, Footer } from "../components/CustomerChrome";

const services = ["Automation solution support", "Installation and commissioning", "Industrial electrical service", "Maintenance response"];

export default function ServiceSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar searchQuery={searchQuery} onSearchChange={(event) => setSearchQuery(event.target.value)} />
      <main className="section-shell py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-teal-700">Service & Support</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">We Service and Support</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Loyalty Automation was started in January 2008 with a team aimed to support service and installation of automation solutions.
            Emergency service helps ensure a quick response to electrical needs at competitive rates.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                <Wrench className="h-5 w-5" />
              </div>
              <p className="font-black text-slate-950">{service}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

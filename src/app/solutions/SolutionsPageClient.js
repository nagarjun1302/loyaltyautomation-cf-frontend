"use client";

import { Cpu } from "lucide-react";
import { useState } from "react";
import { CustomerNavbar, Footer } from "../components/CustomerChrome";

const solutionAreas = ["PLC", "HMI/MMI", "AC & DC Drives", "AC & DC Motors", "Switch Gear Items", "AC Servo Systems", "Wireless Controllers", "Embedded Technology"];

export default function SolutionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar searchQuery={searchQuery} onSearchChange={(event) => setSearchQuery(event.target.value)} />
      <main className="section-shell py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-teal-700">Solutions</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">India&apos;s leading industrial automation designer</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Loyalty Automation provides industrial automation solutions across PLC, HMI/MMI, drives, motors, switch gear, servo systems,
            wireless controllers and embedded technology.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solutionAreas.map((solution) => (
            <div key={solution} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-800">
                <Cpu className="h-5 w-5" />
              </div>
              <p className="font-black text-slate-950">{solution}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

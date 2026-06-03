"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CustomerNavbar, Footer } from "../components/CustomerChrome";
import { channelPartners } from "../lib/channelPartners";

export default function ChannelPartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar searchQuery={searchQuery} onSearchChange={(event) => setSearchQuery(event.target.value)} />
      <main className="section-shell py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-teal-700">Channel Partners</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Loyalty Automation channel partners</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Loyalty Automation works with leading automation brands and continues to look for new products and principals to expand and diversify operations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {channelPartners.map((partner) => (
            <Link key={partner.slug} href={`/channel-partners/${partner.slug}`} className="group rounded-md border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-teal-800">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 group-hover:text-teal-800">{partner.name}</h2>
              <p className="mt-3 leading-7 text-slate-600">
                {partner.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

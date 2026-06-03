"use client";

import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CustomerNavbar, Footer } from "./CustomerChrome";

export default function ChannelPartnerDetail({ partner }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar searchQuery={searchQuery} onSearchChange={(event) => setSearchQuery(event.target.value)} />
      <main className="section-shell py-12">
        <Link href="/channel-partners" className="mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-700 hover:text-teal-800">
          <ArrowLeft className="h-4 w-4" /> Channel Partners
        </Link>

        <section className="mb-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-teal-800">
            <Building2 className="h-6 w-6" />
          </div>
          <p className="text-xs font-black uppercase tracking-wide text-teal-700">{partner.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">{partner.name}</h1>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{partner.title}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">{partner.description}</p>
        </section>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {partner.products.map((product) => (
            <article key={product.name} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <div className="aspect-square bg-slate-50 p-3">
                <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div className="border-t border-slate-100 p-3">
                <h3 className="text-sm font-black leading-5 text-slate-950">{product.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

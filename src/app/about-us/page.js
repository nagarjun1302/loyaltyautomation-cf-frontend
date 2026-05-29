"use client";

import axios from "axios";
import { ArrowRight, Building2, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CustomerNavbar, Footer } from "../components/CustomerChrome";
import { API_BASE, uniqueCategories } from "../lib/catalog";

export default function AboutUsPage() {
  const [contents, setContents] = useState([]);
  const [products, setProducts] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aboutResponse, productResponse, companyResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/about-us`),
          axios.get(`${API_BASE}/api/customerproductslist`),
          axios.get(`${API_BASE}/info/companyInfo`),
        ]);
        setContents(aboutResponse.data.contents || []);
        if (Array.isArray(productResponse.data.getproduct)) setProducts(productResponse.data.getproduct);
        if (Array.isArray(companyResponse.data) && companyResponse.data[0]) setCompanyInfo(companyResponse.data[companyResponse.data.length - 1]);
      } catch (error) {
        console.error("Unable to load About Us overview:", error);
      }
    };

    loadData();
  }, []);

  const categories = useMemo(() => uniqueCategories(products), [products]);

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar searchQuery={searchQuery} onSearchChange={(event) => setSearchQuery(event.target.value)} categories={categories} products={products} />
      <main className="section-shell py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-teal-700">About Us</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Company information and registration details</h1>
          <p className="mt-4 leading-7 text-slate-600">Browse company profile content and statutory information maintained from the admin console.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {contents.map((content) => {
            const isRegistration = content.slug === "registration-directors-info";
            return (
              <Link key={content.slug} href={`/about-us/${content.slug}`} className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-teal-300 hover:shadow-md">
                <div className="aspect-[16/9] bg-slate-100">
                  <img src={content.imageUrl || "/partnerslogo.png"} alt={content.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-teal-800">
                    {isRegistration ? <FileText className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                  </div>
                  <h2 className="text-2xl font-black text-slate-950">{isRegistration ? "Registration and Director Information" : "Company"}</h2>
                  <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{content.description || content.content}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-black text-teal-700 group-hover:text-teal-900">
                    Open page <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer companyInfo={companyInfo} />
    </div>
  );
}

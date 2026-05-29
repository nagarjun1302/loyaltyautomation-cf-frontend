"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, Building2, ChevronDown, Factory, FileText, Layers3, Mail, Menu, Phone, Search, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { API_BASE, displayCategoryName, normalizeCategoryName } from "../lib/catalog";

export function CustomerNavbar({ searchQuery = "", onSearchChange, categories = [], products = [] }) {
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [menuCategories, setMenuCategories] = useState([]);
  const menuPreviewLimit = 3;

  useEffect(() => {
    const loadProductMenu = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/products-menu`);
        if (Array.isArray(response.data.categories)) setMenuCategories(response.data.categories);
      } catch (error) {
        console.error("Unable to load product menu:", error);
      }
    };

    loadProductMenu();
  }, []);

  const fallbackGroupedProducts = useMemo(() => {
    const groups = new Map();

    categories.forEach((category) => {
      groups.set(category.key, { key: category.key, name: category.name, products: [] });
    });

    products.forEach((product) => {
      const key = normalizeCategoryName(product.category);
      if (!key) return;

      if (!groups.has(key)) {
        groups.set(key, { key, name: displayCategoryName(product.category), products: [] });
      }

      groups.get(key).products.push(product);
    });

    return [...groups.values()]
      .filter((group) => group.products.length > 0)
      .map((group) => ({ ...group, totalCount: group.products.length }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, products]);

  const groupedProducts = (menuCategories.length > 0 ? menuCategories : fallbackGroupedProducts)
    .filter((category) => Array.isArray(category.products) && category.products.length > 0)
    .map((category) => ({
      ...category,
      totalCount: category.totalCount || category.count || category.products.length,
      products: category.products.slice(0, menuPreviewLimit),
    }));

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileProductsOpen(false);
    setMobileAboutOpen(false);
  };

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="section-shell flex min-h-18 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo123.png" alt="Loyalty Automation" className="h-10 w-auto" />
          <div className="hidden sm:block">
            {/* <p className="text-sm font-bold uppercase tracking-wide text-slate-900">Loyalty Automation</p> */}
            {/* <p className="text-xs text-slate-500">Industrial B2B Supplies</p> */}
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <label className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search products, categories, specs..."
              className="focus-ring h-12 w-full rounded-md border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900"
            />
          </label>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          <div className="group relative">
            <Link href="/#products" className="inline-flex items-center gap-1 py-3 hover:text-teal-700">
              Products <ChevronDown className="h-4 w-4 transition duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute right-0 top-full w-[min(860px,calc(100vw-32px))] translate-y-3 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-md border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 px-1.5 pb-2">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                    <Layers3 className="h-4 w-4 text-teal-700" /> Products by Category
                  </div>
                  <Link href="/customer/customervisit" className="text-xs font-black uppercase tracking-wide text-teal-700 hover:text-teal-900">View all</Link>
                </div>
                <div className="grid max-h-[460px] gap-1.5 overflow-y-auto p-1 lg:grid-cols-4">
                  {groupedProducts.length > 0 ? groupedProducts.map((category) => (
                    <div key={category.key} className="rounded-md border border-slate-100 bg-slate-50 p-2 transition hover:border-teal-200 hover:bg-teal-50/50">
                      <Link href={`/customer/customervisit?category=${encodeURIComponent(category.key)}`} className="flex items-center justify-between gap-2 truncate text-xs font-black text-slate-950 hover:text-teal-800">
                        <span className="truncate">{category.name}</span>
                        <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-500">{category.totalCount}</span>
                      </Link>
                      <div className="mt-1.5 grid gap-1">
                        {category.products.map((product) => (
                          <Link key={product._id} href={`/customer/customervisit?productId=${product._id}`} className="rounded-sm px-1.5 py-1 transition hover:bg-white hover:shadow-sm">
                            <span className="line-clamp-1 text-[11px] font-bold leading-4 text-slate-700">{product.title}</span>
                          </Link>
                        ))}
                        <Link href={`/customer/customervisit?category=${encodeURIComponent(category.key)}`} className="mt-1 rounded-sm px-1.5 py-1 text-[11px] font-black text-teal-700 hover:bg-white hover:text-teal-900">
                          Show more
                        </Link>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 rounded-md border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-500">Products will appear after catalog data loads.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="group relative">
            <Link href="/about-us/company" className="inline-flex items-center gap-1 py-3 hover:text-teal-700">
              About Us <ChevronDown className="h-4 w-4 transition duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute right-0 top-full w-72 translate-y-3 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-md border border-slate-200 bg-white p-2 shadow-2xl">
                <Link href="/about-us/company" className="flex items-center gap-3 rounded-md px-3 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                  <Building2 className="h-4 w-4" /> Company
                </Link>
                <Link href="/about-us/registration-directors-info" className="flex items-center gap-3 rounded-md px-3 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                  <FileText className="h-4 w-4" /> Registration and Director Information
                </Link>
              </div>
            </div>
          </div>
          <Link href="/customer/customervisit" className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 text-white hover:bg-teal-800">
            Send Inquiry <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className="focus-ring rounded-md border border-slate-200 p-2 md:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="section-shell pb-3 lg:hidden">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search catalog..."
            className="focus-ring h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm"
          />
        </label>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="section-shell grid gap-2 py-4 text-sm font-semibold text-slate-700">
            <button onClick={() => setMobileProductsOpen(!mobileProductsOpen)} className="flex items-center justify-between py-2 text-left">
              Products <ChevronDown className={`h-4 w-4 transition ${mobileProductsOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileProductsOpen && (
              <div className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                {groupedProducts.map((category) => (
                  <details key={category.key} className="rounded-md bg-white px-3 py-2">
                    <summary className="cursor-pointer font-black text-slate-900">{category.name}</summary>
                    <div className="mt-2 grid gap-2 pl-2">
                      <Link onClick={closeMobileMenu} href={`/customer/customervisit?category=${encodeURIComponent(category.key)}`} className="text-teal-700">View category</Link>
                      {category.products.slice(0, menuPreviewLimit).map((product) => (
                        <Link key={product._id} onClick={closeMobileMenu} href={`/customer/customervisit?productId=${product._id}`} className="line-clamp-1 text-slate-500">
                          {product.title}
                        </Link>
                      ))}
                      <Link onClick={closeMobileMenu} href={`/customer/customervisit?category=${encodeURIComponent(category.key)}`} className="font-black text-teal-700">Show more</Link>
                    </div>
                  </details>
                ))}
              </div>
            )}
            <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)} className="flex items-center justify-between py-2 text-left">
              About Us <ChevronDown className={`h-4 w-4 transition ${mobileAboutOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileAboutOpen && (
              <div className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                <Link onClick={closeMobileMenu} href="/about-us/company" className="py-2">Company</Link>
                <Link onClick={closeMobileMenu} href="/about-us/registration-directors-info" className="py-2">Registration and Director Information</Link>
              </div>
            )}
            <Link onClick={closeMobileMenu} href="/customer/customervisit" className="py-2">Send Inquiry</Link>
          </div>
        </div>
      )}
    </header>
    <div aria-hidden="true" className="h-[128px] lg:h-[73px]" />
    </>
  );
}

export function Hero({ productCount = 0, categoryCount = 0 }) {
  return (
    <section className="industrial-grid border-b border-slate-200 bg-slate-950 text-white">
      <div className="section-shell grid min-h-[520px] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="mb-4 inline-flex items-center gap-2 rounded-sm border border-teal-400/40 bg-teal-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-100">
            <Factory className="h-4 w-4" /> Authorized industrial automation catalog
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Automation products built for factories, panels, OEMs and maintenance teams.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Browse drives, control products and industrial components with clear specs, brochures and fast B2B inquiry support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#products" className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 font-bold text-slate-950 hover:bg-amber-300">
              Explore Products <ArrowRight className="h-5 w-5" />
            </a>
            <Link href="/customer/customervisit" className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-3 font-bold text-white hover:bg-white/10">
              Request Quote
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="grid gap-4">
          <div className="rounded-md border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
              <Metric value={`${productCount}+`} label="Listed products" />
              <Metric value={`${categoryCount}+`} label="Categories" />
              <Metric value="24h" label="Inquiry response" />
              <Metric value="B2B" label="Quotation workflow" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Trust icon={<ShieldCheck className="h-5 w-5" />} title="Verified specs" text="Technical fields and brochure links stay close to the product." />
            <Trust icon={<Phone className="h-5 w-5" />} title="Sales ready" text="Structured inquiry forms collect purchase-ready details." />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Metric({ value, label }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-900/80 p-4">
      <p className="text-3xl font-black text-amber-300">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}

function Trust({ icon, title, text }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/8 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-teal-500/20 text-teal-100">{icon}</div>
      <p className="font-bold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

export function Footer({ companyInfo }) {
  return (
    <footer className="relative z-40 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="section-shell grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <img src="/logo123.png" alt="Loyalty Automation" className="mb-4 h-10 w-auto brightness-0 invert" />
          <p className="max-w-xl text-sm leading-7">
            {companyInfo?.aboutUs || "Industrial product sourcing, automation components, documentation and inquiry support for B2B buyers."}
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Product Access</p>
          <div className="grid gap-2 text-sm">
            <Link href="/#products" className="hover:text-white">Catalog</Link>
            <Link href="/customer/customervisit" className="hover:text-white">Product Details</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Contact</p>
          <p className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4" /> sales@loyaltyautomation.com</p>
          <p className="mt-2 flex items-center gap-2 text-sm"><Phone className="h-4 w-4" /> Inquiry response within 24 hours</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">© 2026 Loyalty Automation. Industrial B2B catalog.</div>
    </footer>
  );
}

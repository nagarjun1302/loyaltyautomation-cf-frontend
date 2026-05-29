"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { ChevronRight, Filter, PackageSearch, Search, Settings2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerNavbar, Footer, Hero } from "./components/CustomerChrome";
import InquiryModal from "./components/InquiryModal";
import ProductCard from "./components/ProductCard";
import { normalizeCategoryName, uniqueCategories, uploadUrl } from "./lib/catalog";

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, companyResponse] = await Promise.all([
          axios.get("https://server.loyaltyautomation.com/api/customerproductslist"),
          axios.get("https://server.loyaltyautomation.com/info/companyInfo"),
        ]);

        if (Array.isArray(productResponse.data.getproduct)) {
          setProducts(productResponse.data.getproduct);
        }

        if (Array.isArray(companyResponse.data) && companyResponse.data.length > 0) {
          setCompanyInfo(companyResponse.data[companyResponse.data.length - 1]);
        }
      } catch (error) {
        console.error("Error loading storefront data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = useMemo(() => uniqueCategories(products), [products]);
  const visibleCategories = useMemo(
    () => [{ key: "All", name: "All Products", count: products.length }, ...categories.filter((category) => category.count > 0)],
    [categories, products.length]
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || normalizeCategoryName(product.category) === activeCategory;
      const matchesSearch =
        !query ||
        [product.title, product.category, product.description, product.Brand, product.ModelNumber, ...(product.specifications || []).flatMap((spec) => [spec.label, spec.value])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, activeCategory]);

  const featuredProducts = filteredProducts.slice(0, 8);
  const partnerLogos = companyInfo?.partners || [];

  const openProduct = (product) => {
    router.push(`/customer/customervisit?productId=${product._id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar
        searchQuery={searchQuery}
        onSearchChange={(event) => setSearchQuery(event.target.value)}
        categories={categories}
        products={products}
      />
      {/* <Hero productCount={products.length} categoryCount={categories.length} /> */}

      <main>
        <section id="products" className="section-shell py-12">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-teal-700">
                <PackageSearch className="h-4 w-4" /> Industrial Product Range
              </p>
              <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">Find the right component faster</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Search by name, category, brand, model or technical detail. Each product keeps the same backend data while presenting a cleaner buying workflow.
              </p>
            </div>
            <a href="/customer/customervisit" className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm hover:border-teal-300 hover:text-teal-800">
              View full detail catalog <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mb-6 grid gap-5">
            <aside className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 font-black text-slate-950">
                  <Filter className="h-5 w-5 text-teal-700" /> Categories
                </div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">{visibleCategories.length - 1} active categories</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleCategories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`focus-ring group flex min-h-16 items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm font-black transition ${
                      activeCategory === category.key ? "border-slate-950 bg-slate-950 text-white shadow-sm" : "border-slate-200 bg-slate-50 text-slate-700 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900 hover:shadow-sm"
                    }`}
                  >
                    <span className="min-w-0 truncate">{category.name}</span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${activeCategory === category.key ? "bg-white/15 text-white" : "bg-white text-slate-500 group-hover:text-teal-800"}`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <div className="mb-4 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <label className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products, category, brand, model..."
                    className="focus-ring h-12 w-full rounded-md border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm"
                  />
                </label>
                <div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-3 text-sm font-bold text-slate-700">
                  <Settings2 className="h-4 w-4 text-teal-700" /> {filteredProducts.length} results
                </div>
              </div>

              {loading ? (
                <div className="rounded-md border border-slate-200 bg-white p-10 text-center font-bold text-slate-500">Loading catalog...</div>
              ) : featuredProducts.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onView={() => openProduct(product)}
                      onInquiry={() => setSelectedInquiry(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center">
                  <p className="font-black text-slate-950">No matching products</p>
                  <p className="mt-2 text-sm text-slate-500">Try a different category or search term.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="company" className="border-y border-slate-200 bg-white py-12">
          <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-md border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-black uppercase tracking-wide text-teal-700">Company Profile</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Built for repeat industrial buying</h2>
              <p className="mt-4 leading-7 text-slate-600">
                {companyInfo?.aboutUs || "Share company information from the admin panel to make this section dynamic for buyers."}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {companyInfo?.basicInformation &&
                  Object.entries(companyInfo.basicInformation).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="rounded-md border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="mt-1 font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                {companyInfo?.fields?.slice(0, 6).map((field) => (
                  <div key={`${field.label}-${field.value}`} className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{field.label}</p>
                    <p className="mt-1 font-bold text-slate-900">{field.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-4">
              <div className="rounded-md border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-wide text-amber-300">Major Market</p>
                <p className="mt-2 text-2xl font-black">{companyInfo?.majorMarket || "India and export markets"}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(companyInfo?.exportCountries || ["India", "UAE", "Bangladesh", "Nepal"]).map((country) => (
                    <span key={country} className="rounded-sm border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold">{country}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-5">
                <p className="mb-4 text-sm font-black uppercase tracking-wide text-slate-500">Brand Partners</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {partnerLogos.length > 0 ? (
                    partnerLogos.slice(0, 6).map((logo, index) => (
                      <div key={logo || index} className="flex aspect-[3/2] items-center justify-center rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-teal-200">
                        <img
                          src={uploadUrl(logo)}
                          alt={`Partner ${index + 1}`}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.src = "/partnerslogo.png";
                          }}
                          className="max-h-16 max-w-full object-contain"
                        />
                      </div>
                    ))
                  ) : (
                    ["/schneider.png", "/Phoenix.png", "/delta.png", "/partnerslogo.png"].map((logo) => (
                      <div key={logo} className="flex aspect-[3/2] items-center justify-center rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-teal-200">
                        <img src={logo} alt="Partner logo" loading="lazy" className="max-h-16 max-w-full object-contain" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer companyInfo={companyInfo} />
      {selectedInquiry && <InquiryModal product={selectedInquiry} onClose={() => setSelectedInquiry(null)} />}
    </div>
  );
}

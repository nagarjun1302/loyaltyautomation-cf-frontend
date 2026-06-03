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

const homepageSlides = [
  {
    image: "/slides/1.jpg",
    eyebrow: "Welcome to LOYALTY",
    title: "We Make It So You Succeed",
  },
  {
    image: "/slides/banner22.jpg",
    eyebrow: "We Translate",
    title: "Technologies into Values",
  },
  {
    image: "/slides/slide3.jpg",
    eyebrow: "We Provide Solutions",
    title: "With Quality & Cost Effect",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, companyResponse] = await Promise.all([
          axios.get("http://localhost:5005/api/customerproductslist"),
          axios.get("http://localhost:5005/info/companyInfo"),
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % homepageSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
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
  const customCompanyFields = Array.isArray(companyInfo?.fields) ? companyInfo.fields.filter((field) => field.label || field.value) : [];
  const previewCompanyFields = customCompanyFields.slice(0, 6);
  const additionalCompanyFields = customCompanyFields.slice(6);
  const companyTextSections = [
    ["Additional Business", companyInfo?.additionalBusiness],
    ["Team", companyInfo?.team],
  ].filter(([, value]) => value);
  const companyDetailGroups = [
    ["Trade & Market", companyInfo?.tradeAndMarket],
    ["Statutory Profile", companyInfo?.statutoryProfile],
    ["Packaging/Payment and Shipment Details", companyInfo?.packagingPaymentShipment],
  ].filter(([, rows]) => Array.isArray(rows) && rows.some((row) => row.label || row.value));

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
        <section className="relative min-h-[360px] overflow-hidden bg-slate-950 text-white sm:min-h-[460px] lg:min-h-[560px]">
          {homepageSlides.map((slide, index) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
              aria-hidden={index !== activeSlide}
            >
              <img src={slide.image} alt="slide" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/45" />
            </div>
          ))}

          <div className="section-shell relative z-10 flex min-h-[360px] items-center py-16 sm:min-h-[460px] lg:min-h-[560px]">
            <motion.div key={homepageSlides[activeSlide].image} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-3xl">
              <p className="text-lg font-bold uppercase tracking-wide text-white sm:text-2xl">{homepageSlides[activeSlide].eyebrow}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-6xl">{homepageSlides[activeSlide].title}</h1>
            </motion.div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {homepageSlides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 w-8 rounded-full transition ${index === activeSlide ? "bg-white" : "bg-white/45 hover:bg-white/70"}`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

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
              <div className="mb-4 flex flex-col gap-3 rounded-md border border-[#00aeef]/30 bg-[#061a33] p-4 shadow-lg sm:flex-row sm:items-center">
                <label className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#21409a]" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products, category, brand, model..."
                    className="focus-ring h-12 w-full rounded-md border border-[#00aeef]/45 bg-[#102a50] pl-12 pr-4 text-sm font-bold text-white placeholder:text-[#9dc7e7]"
                  />
                </label>
                <div className="inline-flex items-center gap-2 rounded-md border border-[#00aeef]/35 bg-[#ed1c24] px-3 py-3 text-sm font-black text-white">
                  <Settings2 className="h-4 w-4 text-white" /> {filteredProducts.length} results
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
                {previewCompanyFields.map((field) => (
                  <div key={`${field.label}-${field.value}`} className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{field.label}</p>
                    <p className="mt-1 font-bold text-slate-900">{field.value}</p>
                  </div>
                ))}
              </div>

              {companyTextSections.length > 0 && (
                <div className="mt-6 grid gap-4">
                  {companyTextSections.map(([label, value]) => (
                    <section key={label} className="rounded-md border border-slate-200 bg-white p-4">
                      <h3 className="text-sm font-black uppercase tracking-wide text-teal-700">{label}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">{value}</p>
                    </section>
                  ))}
                </div>
              )}

              {additionalCompanyFields.length > 0 && (
                <div className="mt-6 rounded-md border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-black uppercase tracking-wide text-teal-700">Other Details</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {additionalCompanyFields.map((field) => (
                      <div key={`${field.label}-${field.value}`} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{field.label}</p>
                        <p className="mt-1 whitespace-pre-line text-sm font-bold leading-6 text-slate-900">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="grid gap-4">
              <div className="rounded-md border border-slate-200 bg-slate-950 p-4 text-white">
                <p className="text-xs font-black uppercase tracking-wide text-amber-300">Major Market</p>
                <p className="mt-2 text-lg font-black">{companyInfo?.majorMarket || "India and export markets"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(companyInfo?.exportCountries || ["India", "UAE", "Bangladesh", "Nepal"]).map((country) => (
                    <span key={country} className="rounded-sm border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold">{country}</span>
                  ))}
                </div>
              </div>
              {companyDetailGroups.map(([title, rows]) => (
                <section key={title} className="rounded-md border border-slate-200 bg-white p-5">
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-500">{title}</h3>
                  <div className="grid gap-3">
                    {rows.filter((row) => row.label || row.value).map((row, index) => (
                      <div key={`${row.label}-${index}`} className="grid gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[160px_1fr]">
                        <p className="text-sm font-black text-slate-500">{row.label}</p>
                        <p className="text-sm font-bold text-slate-950">{row.value || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
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
                    ["/schneider.png", "/Phoenix.png", "/delta.png", "/motovario.png"].map((logo) => (
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

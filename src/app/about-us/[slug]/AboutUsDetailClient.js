"use client";

import axios from "axios";
import { Building2, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CustomerNavbar, Footer } from "../../components/CustomerChrome";
import { API_BASE, uniqueCategories } from "../../lib/catalog";

const validSlugs = ["company", "registration-directors-info"];

export default function AboutUsDetailPage() {
  const params = useParams();
  const slug = String(params.slug || "company");
  const [content, setContent] = useState(null);
  const [products, setProducts] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const safeSlug = validSlugs.includes(slug) ? slug : "company";
        const [aboutResponse, productResponse, companyResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/about-us/${safeSlug}`),
          axios.get(`${API_BASE}/api/customerproductslist`),
          axios.get(`${API_BASE}/info/companyInfo`),
        ]);

        setContent(aboutResponse.data.content);
        if (Array.isArray(productResponse.data.getproduct)) setProducts(productResponse.data.getproduct);
        if (Array.isArray(companyResponse.data) && companyResponse.data[0])
          setCompanyInfo(companyResponse.data[companyResponse.data.length - 1]);
      } catch (error) {
        console.error("Unable to load About Us content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const categories = useMemo(() => uniqueCategories(products), [products]);
  const isRegistration = slug === "registration-directors-info";

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerNavbar
        searchQuery={searchQuery}
        onSearchChange={(event) => setSearchQuery(event.target.value)}
        categories={categories}
        products={products}
      />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="section-shell py-12">

            {/* BREADCRUMB */}
            <div className="mb-5 flex flex-wrap gap-2 text-sm font-bold text-slate-500">
              <Link href="/" className="hover:text-teal-700">Home</Link>
              <span>/</span>
              <Link href="/about-us" className="hover:text-teal-700">About Us</Link>
              <span>/</span>
              <span className="text-slate-900">
                {isRegistration ? "Registration and Director Information" : "Company"}
              </span>
            </div>

            {loading ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-10 text-center font-bold text-slate-500">
                Loading About Us content...
              </div>
            ) : content ? (

              <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">

                {/* 1. TEXT CONTENT — full width on top */}
                <div className="p-6 lg:p-10">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-teal-800">
                    {isRegistration ? <FileText className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                  </div>
                  <p className="text-xs font-black uppercase tracking-wide text-teal-700">About Us</p>
                  <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                    {content.title}
                  </h1>
                  {content.subtitle && (
                    <p className="mt-3 text-xl font-bold text-slate-700">{content.subtitle}</p>
                  )}
                  {content.description && (
                    <p className="mt-5 leading-7 text-slate-600">{content.description}</p>
                  )}
                  {content.content && (
                    <p className="mt-5 whitespace-pre-line leading-8 text-slate-700">{content.content}</p>
                  )}
                </div>

                {/* 2. HERO IMAGE — full width below text */}
                <div className="w-full">
                  <img
                    src={content.imageUrl || "/partnerslogo.png"}
                    alt={content.title}
                    loading="lazy"
                    className="w-full object-cover object-center"
                    style={{ maxHeight: "480px" }}
                  />
                </div>

                {/* 3. SECONDARY BAND */}
                <div className="border-t border-slate-200 bg-slate-50 p-6 lg:p-10">
                  <div className="grid gap-6 lg:grid-cols-2">

                    {/* Secondary image */}
                    <div
                      className="overflow-hidden rounded-md border border-slate-200 bg-slate-100"
                      style={{ aspectRatio: "4/3" }}
                    >
                      <img
                        src={content.secondaryImageUrl || content.imageUrl || "/partnerslogo.png"}
                        alt={`${content.title} detail`}
                        loading="lazy"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col justify-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-950">
                        Industrial B2B company profile
                      </h2>
                      <p className="leading-7 text-slate-600">
                        This content is maintained from the admin console so buyers always see current
                        company, registration and leadership information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. DYNAMIC BLOCKS */}
                {isRegistration
                  ? <RegistrationBlocks content={content} />
                  : <CompanyBlocks content={content} />
                }

              </article>

            ) : (
              <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                About Us content is not available.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer companyInfo={companyInfo} />
    </div>
  );
}

function CompanyBlocks({ content }) {
  return (
    <div className="p-6 lg:p-10">
      {content.highlights?.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.highlights.map((item) => (
            <div key={item} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <p className="font-bold text-slate-800">{item}</p>
            </div>
          ))}
        </div>
      )}

      {content.facts?.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {content.facts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`} className="rounded-md border border-slate-200 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">{fact.label}</p>
              <p className="mt-1 font-bold text-slate-950">{fact.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RegistrationBlocks({ content }) {
  return (
    <div className="grid gap-6 p-6 lg:p-10">
      {content.registrationDetails?.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-black text-slate-950">Registration Details</h2>
          <div className="overflow-hidden rounded-md border border-slate-200">
            {content.registrationDetails.map((detail) => (
              <div
                key={`${detail.label}-${detail.value}`}
                className="grid gap-1 border-b border-slate-200 bg-white p-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
              >
                <p className="font-black text-slate-500">{detail.label}</p>
                <p className="font-bold text-slate-950">{detail.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.directors?.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-black text-slate-950">Director Information</h2>
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">DIN</th>
                </tr>
              </thead>
              <tbody>
                {content.directors.map((director, index) => (
                  <tr key={`${director.name}-${index}`} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 font-bold text-slate-950">{director.name}</td>
                    <td className="px-4 py-3 text-slate-700">{director.designation}</td>
                    <td className="px-4 py-3 text-slate-700">{director.din}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
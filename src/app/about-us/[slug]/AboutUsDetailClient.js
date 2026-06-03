"use client";

import axios from "axios";
import { Building2, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CustomerNavbar, Footer } from "../../components/CustomerChrome";
import { API_BASE, uniqueCategories } from "../../lib/catalog";

const validSlugs = ["company", "registration-directors-info"];

const profileItems = [
  {
    title: "VISION",
    image: "/profile/2.jpg",
    text:
      "Our vision is to move towards our goal of being a world-class company. To discover the new products. Excite and delight our customers through the best products and services.",
  },
  {
    title: "MISSION",
    image: "/profile/1.jpg",
    text:
      "The world of technology is changing all around us. So Loyalty Automation processes innovative projects and new technologies. Loyalty Automation is a successful manufacturer, supplier and provider of automation as well as electrical services. We translate these advanced technologies into value for our customers through our professional solution. We wish to use the opportunities to achieve our goals.",
  },
  {
    title: "OBJECTIVE",
    image: "/profile/3.jpg",
    text:
      "To be a global and socially responsible company. We make a rapport among our customers through total customer satisfaction. To deliver safe and comfortable products to our customers.",
  },
];

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
                {!isRegistration && (
                  <div className="w-full">
                    <img
                      src={content.imageUrl || "/partnerslogo.png"}
                      alt={content.title}
                      loading="lazy"
                      className="w-full object-cover object-center"
                      style={{ maxHeight: "480px" }}
                    />
                  </div>
                )}
                

                {/* 4. DYNAMIC BLOCKS */}
                {isRegistration
                  ? <RegistrationBlocks content={content} />
                  : <CompanyBlocks content={content} />
                }

                {!isRegistration && <OurProfileSection />}

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

function OurProfileSection() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 p-6 lg:p-10">
      <div className="mb-7 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-wide text-teal-700">Loyalty Automation</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Our Profile</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {profileItems.map((item) => (
          <article key={item.title} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[4/3] bg-white">
              <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
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
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-wide text-teal-700">Company Information</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Basic Information</h2>
          </div>
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            {content.registrationDetails.map((detail) => (
              <div
                key={`${detail.label}-${detail.value}`}
                className="grid gap-1 border-b border-slate-200 p-4 last:border-b-0 sm:grid-cols-[260px_1fr]"
              >
                <p className="font-black text-slate-500">{detail.label}</p>
                <p className="break-words font-bold text-slate-950">{detail.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.directors?.length > 0 && (
        <section>
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-wide text-teal-700">Directors & Key Managerial Personnel</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Current Directors</h2>
          </div>
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-4 py-3">DIN</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {content.directors.map((director, index) => (
                  <tr key={`${director.name}-${index}`} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 font-bold text-slate-950">{director.din}</td>
                    <td className="px-4 py-3 font-bold text-slate-950">{director.name}</td>
                    <td className="px-4 py-3 text-slate-700">{director.designation}</td>
                    <td className="px-4 py-3 text-slate-700">{director.appointmentDate}</td>
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

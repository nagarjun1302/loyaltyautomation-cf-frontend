"use client";

import axios from "axios";
import { Mail, Phone, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { formatPrice, uploadUrl } from "../../lib/catalog";

export default function EnquiryPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("https://server.loyaltyautomation.com/api/submissions", {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setSubmissions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Error fetching submissions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return submissions;
    return submissions.filter((submission) =>
      [
        submission.product?.title,
        submission.product?.description,
        submission.customerInfo?.name,
        submission.customerInfo?.email,
        submission.customerInfo?.phone,
        submission.productInfo?.companyName,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [submissions, query]);

  return (
    <AdminShell title="Enquiries" subtitle="Review customer inquiries submitted from product pages.">
      <div className="mb-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, company, phone, product..." className="focus-ring h-12 w-full rounded-md border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm" />
        </label>
      </div>

      {loading && <div className="rounded-md border border-slate-200 bg-white p-8 text-center font-bold text-slate-500">Loading enquiries...</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

      <div className="grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((submission) => (
            <article key={submission._id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[120px_1fr_280px]">
                <div className="aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  {submission.product?.productimage && <img src={uploadUrl(submission.product.productimage)} alt={submission.product.title} className="h-full w-full object-contain" />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-teal-700">Product Inquiry</p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">{submission.product?.title || "Product"}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{submission.product?.description || "No product description."}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Info label="Quantity" value={submission.productInfo?.quantity || "N/A"} />
                    <Info label="Price" value={formatPrice(submission.product?.price)} />
                    <Info label="GST" value={submission.productInfo?.gstNumber || "N/A"} />
                  </div>
                </div>
                <aside className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-black text-slate-950">{submission.customerInfo?.name || "Customer"}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4" /> {submission.customerInfo?.email || "N/A"}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4" /> {submission.customerInfo?.phone || "N/A"}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Company</p>
                  <p className="font-bold text-slate-800">{submission.productInfo?.companyName || "Not specified"}</p>
                </aside>
              </div>
              {(submission.customerInfo?.description || submission.productInfo?.additionalRequirements) && (
                <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {submission.customerInfo?.description && <p><strong>Requirement:</strong> {submission.customerInfo.description}</p>}
                  {submission.productInfo?.additionalRequirements && <p className="mt-2"><strong>Additional:</strong> {submission.productInfo.additionalRequirements}</p>}
                </div>
              )}
            </article>
          ))
        ) : (
          !loading && <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No enquiries found.</div>
        )}
      </div>
    </AdminShell>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}

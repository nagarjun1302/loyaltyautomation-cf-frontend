"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { formatPrice, uploadUrl } from "../lib/catalog";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  description: "",
  quantity: 1,
  additionalRequirements: "",
  companyName: "",
  gstNumber: "",
};

export default function InquiryModal({ product, onClose }) {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const update = (field, value) => setFormData((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("http://localhost:5005/api/submit", {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
        },
        productInfo: {
          quantity: formData.quantity,
          additionalRequirements: formData.additionalRequirements,
          companyName: formData.companyName,
          gstNumber: formData.gstNumber,
        },
        product: {
          title: product.title,
          price: product.price,
          productimage: product.productimage,
          description: product.description,
        },
      });
      setMessage("Inquiry submitted. Our team will contact you shortly.");
      setFormData(initialForm);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setMessage("Unable to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-md bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">B2B Inquiry</p>
                <h2 className="text-xl font-black text-slate-950">{product.title}</h2>
              </div>
              <button onClick={onClose} className="focus-ring rounded-md border border-slate-200 p-2 hover:bg-slate-50" aria-label="Close inquiry form">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
              <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
                <div className="aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white">
                  {product.productimage && <img src={uploadUrl(product.productimage)} alt={product.title} className="h-full w-full object-contain" />}
                </div>
                <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Quoted product</p>
                  <p className="mt-1 font-black text-slate-950">{product.title}</p>
                  <p className="mt-2 text-lg font-black text-teal-800">{formatPrice(product.price)}</p>
                  <p className="mt-2 text-sm text-slate-600">{product.category}</p>
                </div>
              </aside>

              <form onSubmit={submit} className="grid gap-5 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" value={formData.name} onChange={(value) => update("name", value)} required />
                  <Field label="Email" type="email" value={formData.email} onChange={(value) => update("email", value)} required />
                  <Field label="Phone" value={formData.phone} onChange={(value) => update("phone", value)} required />
                  <Field label="Company" value={formData.companyName} onChange={(value) => update("companyName", value)} />
                  <Field label="GST Number" value={formData.gstNumber} onChange={(value) => update("gstNumber", value)} />
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Quantity</label>
                    <div className="flex h-11 overflow-hidden rounded-md border border-slate-200">
                      <button type="button" onClick={() => update("quantity", Math.max(1, Number(formData.quantity) - 1))} className="w-11 border-r border-slate-200 bg-slate-50 hover:bg-slate-100" aria-label="Decrease quantity">
                        <Minus className="mx-auto h-4 w-4" />
                      </button>
                      <input type="number" min="1" value={formData.quantity} onChange={(event) => update("quantity", Math.max(1, Number(event.target.value) || 1))} className="focus-ring w-full px-3 text-center" />
                      <button type="button" onClick={() => update("quantity", Number(formData.quantity) + 1)} className="w-11 border-l border-slate-200 bg-slate-50 hover:bg-slate-100" aria-label="Increase quantity">
                        <Plus className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <Textarea label="Requirement Summary" value={formData.description} onChange={(value) => update("description", value)} required />
                <Textarea label="Additional Requirements" value={formData.additionalRequirements} onChange={(value) => update("additionalRequirements", value)} />

                {message && <div className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900">{message}</div>}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={onClose} className="focus-ring rounded-md border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
                  <button disabled={submitting} type="submit" className="focus-ring rounded-md bg-[#21409a] px-5 py-3 font-bold text-white hover:bg-[#00aeef] disabled:cursor-not-allowed disabled:bg-slate-400">
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3 text-slate-900" />
    </div>
  );
}

function Textarea({ label, value, onChange, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} rows={4} className="focus-ring w-full resize-none rounded-md border border-slate-200 p-3 text-slate-900" />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, MessageSquare } from "lucide-react";
import { formatPrice, productImages, uploadUrl } from "../lib/catalog";

export default function ProductCard({ product, onView, onInquiry, compact = false }) {
  const images = productImages(product);
  const mainImage = images[0];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl"
    >
      <button onClick={onView} className="relative block aspect-[4/3] overflow-hidden bg-slate-100 text-left">
        {mainImage ? (
          <img src={uploadUrl(mainImage)} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded-sm bg-slate-950/85 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {product.category || "Industrial"}
        </span>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <button onClick={onView} className="text-left">
          <h3 className="line-clamp-2 min-h-12 text-base font-black leading-6 text-slate-900 group-hover:text-teal-800">{product.title}</h3>
        </button>
        {!compact && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description || "Detailed industrial product information available on request."}</p>}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Starting price</p>
            <p className="text-lg font-black text-slate-950">{formatPrice(product.price)}</p>
          </div>
          {product.ProductBroucher && <FileText className="h-5 w-5 text-teal-700" aria-label="Brochure available" />}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={onInquiry} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-3 py-2.5 text-sm font-bold text-white hover:bg-teal-800">
            <MessageSquare className="h-4 w-4" /> Inquiry
          </button>
          <button onClick={onView} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-800 hover:border-teal-300 hover:text-teal-800">
            View <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

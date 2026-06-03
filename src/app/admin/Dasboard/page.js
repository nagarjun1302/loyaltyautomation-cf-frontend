"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { Building2, ClipboardList, FileText, ListTree, PackagePlus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import AdminShell, { AdminStat } from "../../components/AdminShell";

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [products, enquiries] = await Promise.all([
          axios.get("http://localhost:5005/api/getproductslist", { withCredentials: true }),
          axios.get("http://localhost:5005/api/submissions", { withCredentials: true }),
        ]);
        if (Array.isArray(products.data.getproducts)) setProductCount(products.data.getproducts.length);
        if (Array.isArray(enquiries.data)) setEnquiryCount(enquiries.data.length);
      } catch (error) {
        console.error("Unable to load dashboard metrics:", error);
      }
    };
    loadMetrics();
  }, []);

  const actions = [
    { label: "Add Product", href: "/admin/Addproduct", icon: PackagePlus, text: "Create product specs, upload image, brochure and video." },
    { label: "Manage Products", href: "/admin/Getproduct", icon: ShoppingBag, text: "Edit pricing, specs and catalog visibility." },
    { label: "Categories & Brands", href: "/admin/CatalogOptions", icon: ListTree, text: "Manage dropdown options used by product forms." },
    { label: "Enquiries", href: "/admin/Enquiry", icon: ClipboardList, text: "Review submitted buyer requirements." },
    { label: "Company Info", href: "/admin/CompanyInfo", icon: Building2, text: "Update profile, markets and partner logos." },
    { label: "About Us", href: "/admin/AboutUs", icon: FileText, text: "Edit company and registration pages." },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Manage the industrial B2B catalog and sales inquiries.">
      <div className="grid gap-4 md:grid-cols-3">
        <AdminStat label="Products" value={productCount} detail="Live catalog items from the existing product API." />
        <AdminStat label="Enquiries" value={enquiryCount} detail="Buyer submissions captured from the storefront." />
        <AdminStat label="Workflow" value="Active" detail="APIs, cookies and payload formats are unchanged." />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-teal-50 text-teal-800">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-black text-slate-950">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </motion.a>
          );
        })}
      </div>
    </AdminShell>
  );
}

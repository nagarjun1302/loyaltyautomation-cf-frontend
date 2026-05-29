"use client";

import axios from "axios";
import { Check, ChevronsUpDown, ImagePlus, Plus, Search, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { API_BASE } from "../../lib/catalog";

const initialProduct = {
  title: "",
  description: "",
  price: "",
  category: "",
  ProductBroucher: "",
  Productvideo: "",
  Brand: "",
  Usage: "",
  inputPhase: "",
  inputvoltage: "",
  ModelNumber: "",
  MotorRPM: "",
  MaximumTarancientcurrent: "",
  Emcfilter: "",
  Width: "",
  Transmissionframe: "",
  Motorpower: "",
  supplyfrequency: "",
  DiscreteoutputNo: "",
  productimage: [],
  specifications: [],
};

const legacyFields = [
  ["title", "Product Name", "text", true],
  ["price", "Price", "number", true],
  ["Productvideo", "Product Video URL", "url"],
  ["Usage", "Usage"],
  ["inputPhase", "Input Phase"],
  ["inputvoltage", "Input Voltage"],
  ["ModelNumber", "Model Number"],
  ["MotorRPM", "Motor RPM"],
  ["MaximumTarancientcurrent", "Maximum Current"],
  ["Emcfilter", "EMC Filter"],
  ["Width", "Width"],
  ["Transmissionframe", "Transmission Frame"],
  ["Motorpower", "Motor Power"],
  ["supplyfrequency", "Supply Frequency"],
  ["DiscreteoutputNo", "Discrete Output Number"],
];

export default function AddProductPage() {
  const [product, setProduct] = useState(initialProduct);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [brochureName, setBrochureName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      setOptionsLoading(true);
      setOptionsError("");
      try {
        const [categoryResponse, brandResponse] = await Promise.all([
          axios.get(`${API_BASE}/api/catalog-options/category`),
          axios.get(`${API_BASE}/api/catalog-options/brand`),
        ]);
        setCategories(Array.isArray(categoryResponse.data.options) ? categoryResponse.data.options : []);
        setBrands(Array.isArray(brandResponse.data.options) ? brandResponse.data.options : []);
      } catch (error) {
        console.error("Catalog option API failed:", {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });
        setOptionsError(error.response?.data?.message || "Unable to load categories and brands. You can retry or refresh.");
      } finally {
        setOptionsLoading(false);
      }
    };

    loadOptions();

  }, []);

  const updateProduct = (key, value) => setProduct((current) => ({ ...current, [key]: value }));

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []);
    const nextFiles = [...product.productimage, ...files].slice(0, 10);
    const nextPreviews = [
      ...imagePreviews,
      ...files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    ].slice(0, 10);

    setProduct((current) => ({ ...current, productimage: nextFiles }));
    setImagePreviews(nextPreviews);
    event.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]?.url);
    setProduct((current) => ({ ...current, productimage: current.productimage.filter((_, imageIndex) => imageIndex !== index) }));
    setImagePreviews((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleBrochure = (event) => {
    const file = event.target.files?.[0] || "";
    setProduct((current) => ({ ...current, ProductBroucher: file }));
    setBrochureName(file?.name || "");
  };

  const resetForm = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setProduct(initialProduct);
    setImagePreviews([]);
    setBrochureName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    if (!product.title || !product.description || !product.price || !product.category || product.productimage.length === 0 || !product.ProductBroucher) {
      setErrorMessage("Please fill product name, details, price, category, at least one image and brochure.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key === "productimage") {
          value.forEach((file) => formData.append("productimage", file));
        } else if (key === "specifications") {
          formData.append("specifications", JSON.stringify(value));
        } else if (value !== "") {
          formData.append(key, value);
        }
      });

      await axios.post(`${API_BASE}/api/productdetails`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setStatusMessage("Product submitted successfully.");
      resetForm();
    } catch (error) {
      console.error("Error submitting product details:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
      setErrorMessage(error.response?.data?.message || "Something went wrong while saving the product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="Add Product" subtitle="Create catalog products with galleries, brochure, video and dynamic specs.">
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950">Product Information</h2>
            <p className="mt-1 text-sm text-slate-500">Legacy fields remain compatible, and custom specifications are stored dynamically.</p>
          </div>

          {optionsLoading && <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">Loading categories and brands...</div>}
          {optionsError && <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{optionsError}</div>}
          {errorMessage && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{errorMessage}</div>}
          {statusMessage && <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{statusMessage}</div>}

          <div className="grid gap-4 md:grid-cols-2">
            <SearchableSelect label="Product Category" required value={product.category} options={categories} placeholder="Select product category" onChange={(value) => updateProduct("category", value)} />
            <SearchableSelect label="Brand" value={product.Brand} options={brands} placeholder="Select brand" onChange={(value) => updateProduct("Brand", value)} />
            {legacyFields.map(([name, label, type, required]) => (
              <Field key={name} label={label} type={type || "text"} required={required} value={product[name]} onChange={(value) => updateProduct(name, value)} />
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-bold text-slate-700">Product Details *</label>
            <textarea value={product.description} onChange={(event) => updateProduct("description", event.target.value)} rows={6} required className="focus-ring w-full resize-y rounded-md border border-slate-200 p-3 text-slate-900" />
          </div>

          <SpecificationEditor value={product.specifications} onChange={(value) => updateProduct("specifications", value)} />
        </section>

        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Media Uploads</h2>
          <p className="mt-1 text-sm text-slate-500">Upload up to 10 product images. The first image remains the legacy main image.</p>

          <label className="mt-5 block rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-teal-300">
            <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800">
              <ImagePlus className="h-5 w-5 text-teal-700" /> Product Images *
            </span>
            <input type="file" accept="image/*" multiple onChange={handleImages} className="w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white" />
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={preview.url} className="relative rounded-md border border-slate-200 bg-slate-50 p-2">
                  <img src={preview.url} alt={preview.name} className="aspect-square w-full rounded-sm object-contain" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white" aria-label="Remove image">
                    <X className="h-4 w-4" />
                  </button>
                  <p className="mt-2 truncate text-xs font-bold text-slate-500">{index === 0 ? "Main: " : ""}{preview.name}</p>
                </div>
              ))}
            </div>
          )}

          <label className="mt-5 block rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-teal-300">
            <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800">
              <UploadCloud className="h-5 w-5 text-teal-700" /> Product Brochure *
            </span>
            <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleBrochure} className="w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white" />
            {brochureName && <span className="mt-3 block truncate text-sm font-bold text-slate-500">{brochureName}</span>}
          </label>

          <button type="submit" disabled={submitting} className="focus-ring mt-6 h-12 w-full rounded-md bg-teal-700 font-black text-white transition hover:bg-teal-800 disabled:bg-slate-400">
            {submitting ? "Submitting..." : "Submit Product"}
          </button>
        </aside>
      </form>
    </AdminShell>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}{required ? " *" : ""}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3 text-slate-900" />
    </div>
  );
}

function SpecificationEditor({ value, onChange }) {
  const specs = value || [];
  const addSpec = () => onChange([...specs, { label: "", value: "" }]);
  const updateSpec = (index, key, nextValue) => onChange(specs.map((spec, specIndex) => (specIndex === index ? { ...spec, [key]: nextValue } : spec)));
  const removeSpec = (index) => onChange(specs.filter((_, specIndex) => specIndex !== index));

  return (
    <section className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-black text-slate-950">Dynamic Specifications</h3>
          <p className="text-sm text-slate-500">Add fields like Voltage, RPM, Warranty, Weight or any other product detail.</p>
        </div>
        <button type="button" onClick={addSpec} className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Add Field
        </button>
      </div>
      <div className="grid gap-2">
        {specs.map((spec, index) => (
          <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input value={spec.label} onChange={(event) => updateSpec(index, "label", event.target.value)} placeholder="Field name, e.g. Warranty" className="focus-ring h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <input value={spec.value} onChange={(event) => updateSpec(index, "value", event.target.value)} placeholder="Value, e.g. 12 months" className="focus-ring h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <button type="button" onClick={() => removeSpec(index)} className="rounded-md border border-red-200 bg-white px-3 text-red-700 hover:bg-red-50" aria-label="Delete specification">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SearchableSelect({ label, value, onChange, options, placeholder, required = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return options;
    return options.filter((option) => option.name.toLowerCase().includes(search));
  }, [options, query]);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}{required ? " *" : ""}</label>
      <button type="button" onClick={() => setOpen((current) => !current)} className="focus-ring flex h-11 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left text-slate-900">
        <span className={value ? "truncate" : "truncate text-slate-400"}>{value || placeholder}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>
      {required && <input tabIndex={-1} autoComplete="off" value={value} onChange={() => {}} required className="pointer-events-none absolute h-px w-px opacity-0" />}

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
          <label className="relative block border-b border-slate-100">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." className="h-11 w-full px-9 text-sm outline-none" />
          </label>
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button key={option._id || option.name} type="button" onClick={() => { onChange(option.name); setOpen(false); setQuery(""); }} className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                  <span className="truncate">{option.name}</span>
                  {value === option.name && <Check className="h-4 w-4 text-teal-700" />}
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-sm text-slate-500">No options found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

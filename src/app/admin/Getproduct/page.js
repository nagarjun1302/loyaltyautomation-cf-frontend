"use client";

import axios from "axios";
import { Check, ChevronsUpDown, Edit3, ImagePlus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { API_BASE, formatPrice, uploadUrl } from "../../lib/catalog";

const editableFields = [
  ["title", "Product Name"],
  ["description", "Description", "textarea"],
  ["price", "Price", "number"],
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

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editableProductData, setEditableProductData] = useState({});
  const [editableImagePreviews, setEditableImagePreviews] = useState([]);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [categoryResponse, brandResponse] = await Promise.all([
        axios.get(`${API_BASE}/api/catalog-options/category`),
        axios.get(`${API_BASE}/api/catalog-options/brand`),
      ]);
      setCategories(categoryResponse.data.options || []);
      setBrands(brandResponse.data.options || []);
    } catch (err) {
      console.error("Error fetching catalog options", err);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE}/api/getproductslist`, {
        withCredentials: true,
      });
      if (Array.isArray(response.data.getproducts)) {
        setProducts(response.data.getproducts);
      } else {
        setError("Failed to fetch products.");
      }
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to fetch data from the server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return products;
    return products.filter((product) =>
      [product.title, product.category, product.Brand, product.ModelNumber, product.description]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value))
    );
  }, [products, query]);

  const handleEdit = (productId) => {
    const product = products.find((prod) => prod._id === productId);
    editableImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setEditProductId(productId);
    setEditableProductData({ ...product, productimageFiles: [] });
    setEditableImagePreviews([]);
  };

  const handleSave = async () => {
    try {
      const imageFiles = editableProductData.productimageFiles || [];
      let payload = editableProductData;
      let config = { withCredentials: true };

      if (imageFiles.length > 0) {
        const formData = new FormData();
        Object.entries(editableProductData).forEach(([key, value]) => {
          if (key === "productimageFiles") return;
          if (key === "productimages") return;
          if (key === "specifications") {
            formData.append("specifications", JSON.stringify(value || []));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        imageFiles.forEach((file) => formData.append("productimage", file));
        payload = formData;
        config = { ...config, headers: { "Content-Type": "multipart/form-data" } };
      }

      const response = await axios.put(`${API_BASE}/api/update/${editProductId}`, payload, config);
      if (response.status === 200) {
        setProducts((current) =>
          current.map((product) => (product._id === editProductId ? response.data.product : product))
        );
        editableImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        setEditableImagePreviews([]);
        setEditProductId(null);
      }
    } catch (err) {
      console.error("Error saving the product", err);
      setError("Failed to update the product.");
    }
  };

  const handleEditImages = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 10);
    editableImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setEditableProductData((current) => ({ ...current, productimageFiles: files }));
    setEditableImagePreviews(files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })));
    event.target.value = "";
  };

  const cancelEdit = () => {
    editableImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setEditableImagePreviews([]);
    setEditProductId(null);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE}/api/delete/${productId}`, {
        withCredentials: true,
      });
      if (response.status === 200)
        setProducts((current) => current.filter((product) => product._id !== productId));
    } catch (err) {
      console.error("Error deleting product", err);
      setError("Failed to delete the product.");
    }
  };

  return (
    <AdminShell
      title="Products"
      subtitle="Search, edit and delete catalog items."
      actions={
        <a
          href="/admin/Addproduct"
          className="rounded-md bg-teal-700 px-4 py-2.5 text-sm font-black text-white hover:bg-teal-800"
        >
          Add Product
        </a>
      }
    >
      <div className="mb-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product, category, brand or model..."
            className="focus-ring h-12 w-full rounded-md border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm"
          />
        </label>
      </div>

      {loading && (
        <div className="rounded-md border border-slate-200 bg-white p-8 text-center font-bold text-slate-500">
          Loading products...
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <article
              key={product._id}
              className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
                <div className="border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r">
                  <div className="aspect-square overflow-hidden rounded-md border border-slate-200 bg-white">
                    {product.productimage ? (
                      <img
                        src={uploadUrl(product.productimage)}
                        alt={product.title}
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="p-4">
                  {editProductId === product._id ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <SearchableSelect
                        label="Product Category"
                        value={editableProductData.category || ""}
                        options={categories}
                        placeholder="Select product category"
                        onChange={(value) =>
                          setEditableProductData({ ...editableProductData, category: value })
                        }
                      />
                      <SearchableSelect
                        label="Brand"
                        value={editableProductData.Brand || ""}
                        options={brands}
                        placeholder="Select brand"
                        onChange={(value) =>
                          setEditableProductData({ ...editableProductData, Brand: value })
                        }
                      />
                      {editableFields.map(([name, label, type]) => (
                        <div key={name} className={type === "textarea" ? "md:col-span-2" : ""}>
                          <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
                          {type === "textarea" ? (
                            <textarea
                              value={editableProductData[name] || ""}
                              onChange={(event) =>
                                setEditableProductData({
                                  ...editableProductData,
                                  [name]: event.target.value,
                                })
                              }
                              rows={4}
                              className="focus-ring w-full resize-none rounded-md border border-slate-200 p-3"
                            />
                          ) : (
                            <input
                              type={type || "text"}
                              value={editableProductData[name] || ""}
                              onChange={(event) =>
                                setEditableProductData({
                                  ...editableProductData,
                                  [name]: event.target.value,
                                })
                              }
                              className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3"
                            />
                          )}
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                          Replace Product Images
                        </label>
                        <label className="block rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-teal-300">
                          <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800">
                            <ImagePlus className="h-5 w-5 text-teal-700" /> Choose new images
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleEditImages}
                            className="w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                          />
                          <span className="mt-2 block text-xs font-bold text-slate-500">
                            Selecting images replaces the current product gallery. Leave empty to keep existing images.
                          </span>
                        </label>
                        {editableImagePreviews.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {editableImagePreviews.map((preview, index) => (
                              <div
                                key={preview.url}
                                className="rounded-md border border-slate-200 bg-white p-2"
                              >
                                <img
                                  src={preview.url}
                                  alt={preview.name}
                                  className="aspect-square w-full rounded-sm object-contain"
                                />
                                <p className="mt-2 truncate text-xs font-bold text-slate-500">
                                  {index === 0 ? "Main: " : ""}
                                  {preview.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-teal-700">
                            {product.category || "Industrial"}
                          </p>
                          <h2 className="mt-1 text-xl font-black text-slate-950">
                            {product.title || "Untitled product"}
                          </h2>
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            {product.description || "No description available."}
                          </p>
                        </div>
                        <p className="text-xl font-black text-teal-800">{formatPrice(product.price)}</p>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 xl:grid-cols-4">
                        <Info label="Brand" value={product.Brand} />
                        <Info label="Model" value={product.ModelNumber} />
                        <Info label="Input" value={product.inputvoltage} />
                        <Info label="Brochure" value={product.ProductBroucher} />
                      </div>
                    </>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {editProductId === product._id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="rounded-md bg-green-600 px-4 py-2 text-sm font-black text-white hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800"
                        >
                          <Edit3 className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          !loading && (
            <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No products found.
            </div>
          )
        )}
      </div>
    </AdminShell>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate font-bold text-slate-900">{value || "N/A"}</p>
    </div>
  );
}

function SearchableSelect({ label, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.name.toLowerCase().includes(query));
  }, [options, searchValue]);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="focus-ring flex h-11 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left"
      >
        <span className={value ? "truncate text-slate-900" : "truncate text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
          <label className="relative block border-b border-slate-100">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search..."
              className="h-11 w-full px-9 text-sm outline-none"
            />
          </label>
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option._id}
                  type="button"
                  onClick={() => {
                    onChange(option.name);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800"
                >
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
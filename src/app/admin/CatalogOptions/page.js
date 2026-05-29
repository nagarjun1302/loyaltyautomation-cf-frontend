"use client";

import axios from "axios";
import { Edit3, Plus, Search, Tags, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { API_BASE } from "../../lib/catalog";

const optionTypes = [
  { key: "category", title: "Product Categories", singular: "category" },
  { key: "brand", title: "Brands", singular: "brand" },
];

export default function CatalogOptionsPage() {
  const [activeType, setActiveType] = useState("category");
  const [options, setOptions] = useState({ category: [], brand: [] });
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, []);

  const activeConfig = optionTypes.find((type) => type.key === activeType);

  const visibleOptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    const currentOptions = options[activeType] || [];
    if (!search) return currentOptions;
    return currentOptions.filter((option) => option.name.toLowerCase().includes(search));
  }, [activeType, options, query]);

  const loadOptions = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryResponse, brandResponse] = await Promise.all([
        axios.get(`${API_BASE}/api/catalog-options/category`),
        axios.get(`${API_BASE}/api/catalog-options/brand`),
      ]);
      setOptions({
        category: categoryResponse.data.options || [],
        brand: brandResponse.data.options || [],
      });
    } catch (err) {
      console.error("Unable to load catalog options:", err);
      setError("Unable to load categories and brands.");
    } finally {
      setLoading(false);
    }
  };

  const saveNewOption = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post(`${API_BASE}/api/catalog-options/${activeType}`, { name: newName }, { withCredentials: true });
      setOptions((current) => ({
        ...current,
        [activeType]: [...current[activeType], response.data.option].sort((a, b) => a.name.localeCompare(b.name)),
      }));
      setNewName("");
      setMessage(`${activeConfig.singular} added successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to add ${activeConfig.singular}.`);
    }
  };

  const saveEdit = async (option) => {
    setError("");
    setMessage("");
    try {
      const response = await axios.put(`${API_BASE}/api/catalog-options/${activeType}/${option._id}`, { name: editName }, { withCredentials: true });
      setOptions((current) => ({
        ...current,
        [activeType]: current[activeType].map((item) => (item._id === option._id ? response.data.option : item)).sort((a, b) => a.name.localeCompare(b.name)),
      }));
      setEditId("");
      setEditName("");
      setMessage(`${activeConfig.singular} updated successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to update ${activeConfig.singular}.`);
    }
  };

  const deleteOption = async (option) => {
    setError("");
    setMessage("");
    try {
      await axios.delete(`${API_BASE}/api/catalog-options/${activeType}/${option._id}`, { withCredentials: true });
      setOptions((current) => ({
        ...current,
        [activeType]: current[activeType].filter((item) => item._id !== option._id),
      }));
      setMessage(`${activeConfig.singular} deleted successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to delete ${activeConfig.singular}.`);
    }
  };

  return (
    <AdminShell title="Categories & Brands" subtitle="Manage the dropdown values used while adding and editing products.">
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-800">
              <Tags className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">Option Type</h2>
              <p className="text-sm text-slate-500">Choose the list to maintain.</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {optionTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => {
                  setActiveType(type.key);
                  setQuery("");
                  setEditId("");
                  setNewName("");
                }}
                className={`focus-ring rounded-md border px-3 py-3 text-sm font-black ${
                  activeType === type.key ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:text-teal-800"
                }`}
              >
                {type.key === "category" ? "Categories" : "Brands"}
              </button>
            ))}
          </div>

          <form onSubmit={saveNewOption} className="mt-6">
            <label className="mb-2 block text-sm font-bold text-slate-700">Add {activeConfig.singular}</label>
            <div className="flex gap-2">
              <input value={newName} onChange={(event) => setNewName(event.target.value)} required className="focus-ring h-11 min-w-0 flex-1 rounded-md border border-slate-200 px-3 text-sm" />
              <button type="submit" className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-black text-white hover:bg-teal-800">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </form>
        </aside>

        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">{activeConfig.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{options[activeType]?.length || 0} saved options</p>
            </div>
            <label className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search options..." className="focus-ring h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm" />
            </label>
          </div>

          {message && <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{message}</div>}
          {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

          {loading ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center font-bold text-slate-500">Loading options...</div>
          ) : visibleOptions.length > 0 ? (
            <div className="grid gap-2">
              {visibleOptions.map((option) => (
                <div key={option._id} className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  {editId === option._id ? (
                    <input value={editName} onChange={(event) => setEditName(event.target.value)} className="focus-ring h-10 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold" />
                  ) : (
                    <p className="min-w-0 flex-1 truncate font-bold text-slate-900">{option.name}</p>
                  )}

                  <div className="flex gap-2">
                    {editId === option._id ? (
                      <>
                        <button onClick={() => saveEdit(option)} className="rounded-md bg-green-600 px-3 py-2 text-sm font-black text-white hover:bg-green-700">Save</button>
                        <button onClick={() => setEditId("")} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100">
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(option._id); setEditName(option.name); }} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white hover:bg-slate-800">
                          <Edit3 className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => deleteOption(option)} className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-black text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">No options found.</div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

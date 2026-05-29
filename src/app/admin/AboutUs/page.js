"use client";

import axios from "axios";
import { FileText, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { API_BASE } from "../../lib/catalog";

const configs = [
  { slug: "company", label: "Company" },
  { slug: "registration-directors-info", label: "Registration and Director Information" },
];

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  content: "",
  imageUrl: "",
  secondaryImageUrl: "",
  highlights: [],
  facts: [],
  registrationDetails: [],
  directors: [],
};

export default function AboutUsAdminPage() {
  const [activeSlug, setActiveSlug] = useState("company");
  const [forms, setForms] = useState({
    company: emptyForm,
    "registration-directors-info": emptyForm,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_BASE}/api/about-us`);
        const nextForms = {
          company: emptyForm,
          "registration-directors-info": emptyForm,
        };
        (response.data.contents || []).forEach((item) => {
          nextForms[item.slug] = {
            title: item.title || "",
            subtitle: item.subtitle || "",
            description: item.description || "",
            content: item.content || "",
            imageUrl: item.imageUrl || "",
            secondaryImageUrl: item.secondaryImageUrl || "",
            highlights: item.highlights || [],
            facts: item.facts || [],
            registrationDetails: item.registrationDetails || [],
            directors: item.directors || [],
          };
        });
        setForms(nextForms);
      } catch (err) {
        console.error("Unable to load About Us content:", err);
        setError("Unable to load About Us content.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const form = forms[activeSlug] || emptyForm;
  const isRegistration = activeSlug === "registration-directors-info";

  const updateForm = (key, value) => {
    setForms((current) => ({
      ...current,
      [activeSlug]: {
        ...current[activeSlug],
        [key]: value,
      },
    }));
  };

  const saveContent = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await axios.put(`${API_BASE}/api/about-us/${activeSlug}`, form, { withCredentials: true });
      setForms((current) => ({ ...current, [activeSlug]: response.data.content }));
      setMessage("About Us content saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save About Us content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="About Us" subtitle="Manage Company and Registration / Director Information pages.">
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-800">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">About Us Pages</h2>
              <p className="text-sm text-slate-500">Select the content to edit.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {configs.map((config) => (
              <button
                key={config.slug}
                onClick={() => {
                  setActiveSlug(config.slug);
                  setMessage("");
                  setError("");
                }}
                className={`focus-ring rounded-md border px-3 py-3 text-left text-sm font-black ${
                  activeSlug === config.slug ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:text-teal-800"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </aside>

        <form onSubmit={saveContent} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          {message && <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{message}</div>}
          {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}

          {loading ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center font-bold text-slate-500">Loading content...</div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Page Title" value={form.title} onChange={(value) => updateForm("title", value)} required />
                <Field label="Subtitle" value={form.subtitle} onChange={(value) => updateForm("subtitle", value)} />
                <Field label="Hero Image URL" value={form.imageUrl} onChange={(value) => updateForm("imageUrl", value)} />
                <Field label="Secondary Image URL" value={form.secondaryImageUrl} onChange={(value) => updateForm("secondaryImageUrl", value)} />
              </div>

              <TextArea label="Short Description" value={form.description} onChange={(value) => updateForm("description", value)} rows={3} />
              <TextArea label="Main Content" value={form.content} onChange={(value) => updateForm("content", value)} rows={6} />

              {!isRegistration && (
                <>
                  <ListEditor title="Highlights" value={form.highlights} onChange={(value) => updateForm("highlights", value)} />
                  <PairEditor title="Company Facts" value={form.facts} onChange={(value) => updateForm("facts", value)} />
                </>
              )}

              {isRegistration && (
                <>
                  <PairEditor title="Registration Details" value={form.registrationDetails} onChange={(value) => updateForm("registrationDetails", value)} />
                  <DirectorEditor value={form.directors} onChange={(value) => updateForm("directors", value)} />
                </>
              )}

              <button type="submit" disabled={saving} className="focus-ring inline-flex h-12 w-fit items-center gap-2 rounded-md bg-teal-700 px-5 font-black text-white hover:bg-teal-800 disabled:bg-slate-400">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Content"}
              </button>
            </div>
          )}
        </form>
      </div>
    </AdminShell>
  );
}

function Field({ label, value, onChange, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3 text-slate-900" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="focus-ring w-full resize-y rounded-md border border-slate-200 p-3 text-slate-900" />
    </div>
  );
}

function ListEditor({ title, value, onChange }) {
  const addItem = () => onChange([...(value || []), ""]);
  const updateItem = (index, nextValue) => onChange(value.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  const removeItem = (index) => onChange(value.filter((_, itemIndex) => itemIndex !== index));

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950">{title}</h3>
        <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="grid gap-2">
        {(value || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <input value={item} onChange={(event) => updateItem(index, event.target.value)} className="focus-ring h-11 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <button type="button" onClick={() => removeItem(index)} className="rounded-md border border-red-200 bg-white px-3 text-red-700 hover:bg-red-50" aria-label="Remove item">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PairEditor({ title, value, onChange }) {
  const rows = value || [];
  const addRow = () => onChange([...rows, { label: "", value: "" }]);
  const updateRow = (index, key, nextValue) => onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: nextValue } : row)));
  const removeRow = (index) => onChange(rows.filter((_, rowIndex) => rowIndex !== index));

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950">{title}</h3>
        <button type="button" onClick={addRow} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="grid gap-2">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input value={row.label || ""} onChange={(event) => updateRow(index, "label", event.target.value)} placeholder="Label" className="focus-ring h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <input value={row.value || ""} onChange={(event) => updateRow(index, "value", event.target.value)} placeholder="Value" className="focus-ring h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <button type="button" onClick={() => removeRow(index)} className="rounded-md border border-red-200 bg-white px-3 text-red-700 hover:bg-red-50" aria-label="Remove row">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function DirectorEditor({ value, onChange }) {
  const rows = value || [];
  const addRow = () => onChange([...rows, { name: "", designation: "", din: "" }]);
  const updateRow = (index, key, nextValue) => onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: nextValue } : row)));
  const removeRow = (index) => onChange(rows.filter((_, rowIndex) => rowIndex !== index));

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950">Director Information</h3>
        <button type="button" onClick={addRow} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="grid gap-2">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <input value={row.name || ""} onChange={(event) => updateRow(index, "name", event.target.value)} placeholder="Name" className="focus-ring h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <input value={row.designation || ""} onChange={(event) => updateRow(index, "designation", event.target.value)} placeholder="Designation" className="focus-ring h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <input value={row.din || ""} onChange={(event) => updateRow(index, "din", event.target.value)} placeholder="DIN" className="focus-ring h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <button type="button" onClick={() => removeRow(index)} className="rounded-md border border-red-200 bg-white px-3 text-red-700 hover:bg-red-50" aria-label="Remove director">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

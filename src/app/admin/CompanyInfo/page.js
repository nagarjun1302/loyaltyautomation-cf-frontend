"use client";

import axios from "axios";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { API_BASE, uploadUrl } from "../../lib/catalog";

const normalizeTradeAndMarketRows = (rows = []) => {
  if (!Array.isArray(rows)) return [];

  return rows.filter((row) => String(row?.label || "").trim().toLowerCase() !== "major market");
};

const normalizeStatutoryProfileRows = (rows = []) => {
  if (!Array.isArray(rows)) return [];

  return rows.map((row) => {
    const label = String(row?.label || "").trim();
    return {
      ...row,
      label: label.toLowerCase() === "pan no." ? "Tan No." : row.label,
    };
  });
};

const rowsOrDefault = (rows, fallback) => (rows.length ? rows : fallback);

const initialFormData = {
  annualTurnover: "",
  legalStatus: "",
  gstRegistrationDate: "",
  numberOfEmployees: "",
  companyCEO: "",
  natureOfBusiness: "",
  majorMarket: "",
  aboutUs: "",
  additionalBusiness: "",
  team: "",
  exportCountries: "",
  tradeAndMarket: [
    { label: "Export Percentage", value: "" },
  ],
  statutoryProfile: [
    { label: "GST No.", value: "" },
    { label: "CIN No.", value: "" },
    { label: "Banker", value: "" },
    { label: "DGFT / IE Code", value: "" },
    { label: "Tan No.", value: "" },
  ],
  packagingPaymentShipment: [
    { label: "Payment Mode", value: "" },
    { label: "Shipment Mode", value: "" },
  ],
  fields: [],
};

const fields = [
  ["annualTurnover", "Annual Turnover"],
  ["legalStatus", "Legal Status"],
  ["gstRegistrationDate", "GST Registration Date"],
  ["numberOfEmployees", "Number of Employees"],
  ["companyCEO", "Company CEO"],
  ["natureOfBusiness", "Nature of Business"],
  ["majorMarket", "Major Market"],
  ["exportCountries", "Export Countries (comma separated)"],
];

const textAreas = [
  ["aboutUs", "About Us"],
  ["additionalBusiness", "Additional Business"],
  ["team", "Team"],
];

export default function CompanyInfoPage() {
  const [companyId, setCompanyId] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [existingPartners, setExistingPartners] = useState([]);
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      setInitialLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/info/companyInfo`);
        const latest = Array.isArray(response.data) ? response.data[response.data.length - 1] : null;
        if (!latest) return;

        const tradeAndMarket = normalizeTradeAndMarketRows(latest.tradeAndMarket);
        const statutoryProfile = normalizeStatutoryProfileRows(latest.statutoryProfile);

        setCompanyId(latest._id);
        setExistingPartners(latest.partners || []);
        setFormData({
          annualTurnover: latest.basicInformation?.annualTurnover || "",
          legalStatus: latest.basicInformation?.legalStatus || "",
          gstRegistrationDate: latest.basicInformation?.gstRegistrationDate || "",
          numberOfEmployees: latest.basicInformation?.numberOfEmployees || "",
          companyCEO: latest.basicInformation?.companyCEO || "",
          natureOfBusiness: latest.basicInformation?.natureOfBusiness || "",
          majorMarket: latest.majorMarket || "",
          aboutUs: latest.aboutUs || "",
          additionalBusiness: latest.additionalBusiness || "",
          team: latest.team || "",
          exportCountries: Array.isArray(latest.exportCountries) ? latest.exportCountries.join(", ") : "",
          tradeAndMarket: rowsOrDefault(tradeAndMarket, initialFormData.tradeAndMarket),
          statutoryProfile: rowsOrDefault(statutoryProfile, initialFormData.statutoryProfile),
          packagingPaymentShipment: latest.packagingPaymentShipment?.length ? latest.packagingPaymentShipment : initialFormData.packagingPaymentShipment,
          fields: latest.fields || [],
        });
      } catch (error) {
        setMessage({ type: "error", text: error.response?.data?.message || "Unable to load company information." });
      } finally {
        setInitialLoading(false);
      }
    };

    loadCompany();
  }, []);

  const handleFileChange = (event) => {
    const newSelectedFiles = Array.from(event.target.files || []);
    if (files.length + newSelectedFiles.length > 5) {
      setFileError(`You can only upload a maximum of 5 images. You already have ${files.length} images selected.`);
      return;
    }
    setFileError("");
    const updatedFiles = [...files, ...newSelectedFiles];
    setFiles(updatedFiles);
    setFilePreview([
      ...filePreview,
      ...newSelectedFiles.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    ]);
    event.target.value = "";
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(filePreview[index].url);
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setFilePreview((current) => current.filter((_, fileIndex) => fileIndex !== index));
  };

  const addDynamicField = () => {
    setFormData((current) => ({
      ...current,
      fields: [...current.fields, { label: "", value: "", multiline: false }],
    }));
  };

  const updateDynamicField = (index, key, value) => {
    setFormData((current) => ({
      ...current,
      fields: current.fields.map((field, fieldIndex) => (fieldIndex === index ? { ...field, [key]: value } : field)),
    }));
  };

  const deleteDynamicField = (index) => {
    setFormData((current) => ({
      ...current,
      fields: current.fields.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const form = new FormData();
    const payload = {
      ...formData,
      tradeAndMarket: normalizeTradeAndMarketRows(formData.tradeAndMarket),
      statutoryProfile: normalizeStatutoryProfileRows(formData.statutoryProfile),
    };

    Object.entries(payload).forEach(([key, value]) => {
      if (["fields", "tradeAndMarket", "statutoryProfile", "packagingPaymentShipment"].includes(key)) form.append(key, JSON.stringify(value));
      else form.append(key, value);
    });
    files.forEach((file) => form.append("partners", file));

    try {
      const url = companyId ? `${API_BASE}/info/companyInfo/${companyId}` : `${API_BASE}/info/companyInfo`;
      const method = companyId ? "put" : "post";
      const response = await axios[method](url, form, { headers: { "Content-Type": "multipart/form-data" } });
      setCompanyId(response.data.company?._id || companyId);
      setExistingPartners(response.data.company?.partners || existingPartners);
      setMessage({ type: "success", text: response.data.message || "Company information saved." });
      filePreview.forEach((preview) => URL.revokeObjectURL(preview.url));
      setFiles([]);
      setFilePreview([]);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "An error occurred during submission." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell title="Company Info" subtitle="Edit public company profile, market details, statutory data and partner logos.">
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-6">
          {message && (
            <div className={`mb-4 rounded-md px-4 py-3 text-sm font-bold ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}
          {initialLoading && <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">Loading existing company information...</div>}

          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader title="Basic Information" />
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map(([name, label]) => (
                <Field key={name} label={label} value={formData[name]} onChange={(value) => setFormData({ ...formData, [name]: value })} />
              ))}
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader title="Company Details" />
            <div className="grid gap-4">
              {textAreas.map(([name, label]) => (
                <TextArea key={name} label={label} value={formData[name]} onChange={(value) => setFormData({ ...formData, [name]: value })} />
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <EditableRows
              title="Trade & Market"
              rows={formData.tradeAndMarket}
              onChange={(rows) => setFormData({ ...formData, tradeAndMarket: normalizeTradeAndMarketRows(rows) })}
            />
            <EditableRows
              title="Statutory Profile"
              rows={formData.statutoryProfile}
              onChange={(rows) => setFormData({ ...formData, statutoryProfile: normalizeStatutoryProfileRows(rows) })}
            />
            <div className="lg:col-span-2">
              <EditableRows
                title="Packaging/Payment and Shipment Details"
                rows={formData.packagingPaymentShipment}
                onChange={(rows) => setFormData({ ...formData, packagingPaymentShipment: rows })}
              />
            </div>
          </div>

          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-black text-slate-950">Custom Company Fields</h2>
                <p className="text-sm text-slate-500">Add, edit or delete fields without changing the database schema.</p>
              </div>
              <button type="button" onClick={addDynamicField} className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white hover:bg-slate-800">
                <Plus className="h-4 w-4" /> Add Field
              </button>
            </div>
            <div className="grid gap-3">
              {formData.fields.map((field, index) => (
                <div key={index} className="rounded-md border border-slate-200 bg-white p-3">
                  <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                    <input value={field.label || ""} onChange={(event) => updateDynamicField(index, "label", event.target.value)} placeholder="Field label" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm" />
                    {field.multiline ? (
                      <textarea value={field.value || ""} onChange={(event) => updateDynamicField(index, "value", event.target.value)} placeholder="Field value" rows={3} className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    ) : (
                      <input value={field.value || ""} onChange={(event) => updateDynamicField(index, "value", event.target.value)} placeholder="Field value" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm" />
                    )}
                    <button type="button" onClick={() => deleteDynamicField(index)} className="rounded-md border border-red-200 px-3 text-red-700 hover:bg-red-50" aria-label="Delete field">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <label className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-slate-600">
                    <input type="checkbox" checked={Boolean(field.multiline)} onChange={(event) => updateDynamicField(index, "multiline", event.target.checked)} />
                    Multiline value
                  </label>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-28">
          <h2 className="text-xl font-black text-slate-950">Partner Images</h2>
          <p className="mt-1 text-sm text-slate-500">Upload up to 5 partner or brand logos. Existing logos stay unless new ones are uploaded.</p>
          {fileError && <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{fileError}</div>}

          {existingPartners.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {existingPartners.map((logo, index) => (
                <div key={`${logo}-${index}`} className="flex aspect-[3/2] items-center justify-center rounded-md border border-slate-200 bg-slate-50 p-3">
                  <img src={uploadUrl(logo)} alt={`Partner ${index + 1}`} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          )}

          <label className="mt-5 block rounded-md border border-dashed border-slate-300 bg-slate-50 p-5">
            <span className="mb-3 flex items-center gap-2 font-black text-slate-800">
              <ImagePlus className="h-5 w-5 text-teal-700" /> Replace Logos
            </span>
            <input type="file" name="partners" accept="image/*" multiple onChange={handleFileChange} className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white" />
            <span className="mt-3 block text-sm font-bold text-slate-500">{files.length}/5 selected</span>
          </label>

          {filePreview.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {filePreview.map((file, index) => (
                <div key={file.url} className="relative rounded-md border border-slate-200 bg-slate-50 p-2">
                  <img src={file.url} alt={file.name} className="aspect-square w-full rounded-sm object-contain" />
                  <button type="button" onClick={() => removeFile(index)} className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white" aria-label="Remove image">
                    <X className="h-4 w-4" />
                  </button>
                  <p className="mt-2 truncate text-xs font-bold text-slate-500">{file.name}</p>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading || Boolean(fileError)} className="focus-ring mt-6 h-12 w-full rounded-md bg-teal-700 font-black text-white hover:bg-teal-800 disabled:bg-slate-400">
            {loading ? "Saving..." : "Save Company Info"}
          </button>
        </aside>
      </form>
    </AdminShell>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="mb-4 border-b border-slate-100 pb-3">
      <h2 className="font-black text-slate-950">{title}</h2>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring h-11 w-full rounded-md border border-slate-200 px-3 text-slate-900" />
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="focus-ring w-full resize-y rounded-md border border-slate-200 p-3 text-slate-900" />
    </div>
  );
}

function EditableRows({ title, rows, onChange }) {
  const updateRow = (index, key, value) => {
    onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  };

  const addRow = () => {
    onChange([...(rows || []), { label: "", value: "" }]);
  };

  const deleteRow = (index) => {
    onChange(rows.filter((_, rowIndex) => rowIndex !== index));
  };

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-black text-slate-950">{title}</h2>
        <button type="button" onClick={addRow} className="rounded-md bg-slate-950 px-3 py-2 text-xs font-black text-white hover:bg-slate-800">
          Add
        </button>
      </div>
      <div className="grid gap-3">
        {(rows || []).map((row, index) => (
          <div key={index} className="grid gap-2 rounded-md border border-slate-200 bg-white p-3">
            <input value={row.label || ""} onChange={(event) => updateRow(index, "label", event.target.value)} placeholder="Label" className="focus-ring h-10 rounded-md border border-slate-200 px-3 text-sm" />
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input value={row.value || ""} onChange={(event) => updateRow(index, "value", event.target.value)} placeholder="Value" className="focus-ring h-10 rounded-md border border-slate-200 px-3 text-sm" />
              <button type="button" onClick={() => deleteRow(index)} className="rounded-md border border-red-200 px-3 text-red-700 hover:bg-red-50" aria-label={`Delete ${title} row`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

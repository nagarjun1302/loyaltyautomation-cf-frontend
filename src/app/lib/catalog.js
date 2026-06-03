export const API_BASE = "http://localhost:5005";

export function uploadUrl(fileName) {
  if (!fileName) return "";
  const normalized = String(fileName)
    .replace(/^\/?uploads[\\/]/, "")
    .replace(/^\/?partners[\\/]/, "");
  return `${API_BASE}/api/uploads/${normalized}`;
}

export function formatPrice(value) {
  const amount = Number(value || 0);
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

export function normalizeCategoryName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

export function displayCategoryName(value) {
  const acronymWords = new Map([
    ["ac", "AC"],
    ["hmi", "HMI"],
    ["plc", "PLC"],
    ["vfd", "VFD"],
  ]);

  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      const normalized = word.toLowerCase();
      if (acronymWords.has(normalized)) return acronymWords.get(normalized);
      return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word;
    })
    .join(" ");
}

export function uniqueCategories(products) {
  const grouped = new Map();

  products.forEach((product) => {
    const normalized = normalizeCategoryName(product.category);
    if (!normalized) return;

    const current = grouped.get(normalized);
    grouped.set(normalized, {
      key: normalized,
      name: current?.name || displayCategoryName(product.category),
      count: (current?.count || 0) + 1,
    });
  });

  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function productSpecs(product) {
  const fixedSpecs = [
    ["Brand", product.Brand],
    ["Usage", product.Usage],
    ["Input Phase", product.inputPhase],
    ["Input Voltage", product.inputvoltage],
    ["Model Number", product.ModelNumber],
    ["Motor RPM", product.MotorRPM],
    ["Max Current", product.MaximumTarancientcurrent],
    ["EMC Filter", product.Emcfilter],
    ["Width", product.Width],
    ["Transmission Frame", product.Transmissionframe],
    ["Motor Power", product.Motorpower],
    ["Supply Frequency", product.supplyfrequency],
    ["Discrete Output", product.DiscreteoutputNo],
  ].filter(([, value]) => value);

  const dynamicSpecs = Array.isArray(product.specifications)
    ? product.specifications
        .map((spec) => [spec.label, spec.value])
        .filter(([label, value]) => label && value)
    : [];

  return [...fixedSpecs, ...dynamicSpecs];
}

export function productImages(product) {
  const images = Array.isArray(product?.productimages) ? product.productimages : [];
  return [...new Set([product?.productimage, ...images].filter(Boolean))];
}

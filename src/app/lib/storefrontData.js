import { API_BASE } from "./catalog";

async function fetchJson(path) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      console.error(`Storefront fetch failed for ${path}: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`Storefront fetch failed for ${path}:`, error);
    return null;
  }
}

export async function getStorefrontData() {
  const [productData, companyData] = await Promise.all([
    fetchJson("/api/customerproductslist"),
    fetchJson("/info/companyInfo"),
  ]);

  const products = Array.isArray(productData?.getproduct) ? productData.getproduct : [];
  const companyInfo = Array.isArray(companyData) && companyData.length > 0 ? companyData[companyData.length - 1] : null;

  return { products, companyInfo };
}

import ProductVisitPage from "./ProductVisitPageClient";
import { createMetadata } from "../../lib/seo";
import { getStorefrontData } from "../../lib/storefrontData";

export const dynamic = "force-static";

export const metadata = createMetadata({
  title: "Industrial Product Catalog | Loyalty Automation",
  description: "Search Loyalty Automation industrial product catalog with product specifications, brochures, videos, pricing, and inquiry options.",
  path: "/customer/customervisit",
});

export default async function Page() {
  const storefrontData = await getStorefrontData();

  return <ProductVisitPage {...storefrontData} />;
}

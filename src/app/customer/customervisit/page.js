import ProductVisitPage from "./ProductVisitPageClient";
import { createMetadata } from "../../lib/seo";

export const metadata = createMetadata({
  title: "Industrial Product Catalog | Loyalty Automation",
  description: "Search Loyalty Automation industrial product catalog with product specifications, brochures, videos, pricing, and inquiry options.",
  path: "/customer/customervisit",
});

export default function Page() {
  return <ProductVisitPage />;
}

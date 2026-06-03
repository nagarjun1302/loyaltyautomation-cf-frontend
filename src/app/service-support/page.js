import ServiceSupportPage from "./ServiceSupportPageClient";
import { createMetadata } from "../lib/seo";

export const metadata = createMetadata({
  title: "Service and Support | Loyalty Automation",
  description: "Automation service, installation, commissioning, maintenance, and industrial electrical support from Loyalty Automation.",
  path: "/service-support",
});

export default function Page() {
  return <ServiceSupportPage />;
}

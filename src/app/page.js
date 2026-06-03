import HomePage from "./HomePageClient";
import { createMetadata } from "./lib/seo";

export const metadata = createMetadata({
  title: "Loyalty Automation | Industrial Automation Products",
  description: "Browse industrial automation products, drives, PLC, HMI, control components, brochures, specifications, and B2B inquiry support.",
  path: "/",
  image: "/slides/1.jpg",
});

export default function Page() {
  return <HomePage />;
}

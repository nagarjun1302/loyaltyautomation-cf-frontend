import SolutionsPage from "./SolutionsPageClient";
import { createMetadata } from "../lib/seo";

export const metadata = createMetadata({
  title: "Industrial Automation Solutions | Loyalty Automation",
  description: "Industrial automation solutions for PLC, HMI, AC and DC drives, motors, switchgear, servo systems, wireless controllers, and embedded technology.",
  path: "/solutions",
});

export default function Page() {
  return <SolutionsPage />;
}

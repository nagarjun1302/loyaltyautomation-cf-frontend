import AboutUsPage from "./AboutUsPageClient";
import { createMetadata } from "../lib/seo";

export const metadata = createMetadata({
  title: "About Loyalty Automation | Company Information",
  description: "Read Loyalty Automation company profile, registration details, director information, vision, mission, and industrial automation background.",
  path: "/about-us",
});

export default function Page() {
  return <AboutUsPage />;
}

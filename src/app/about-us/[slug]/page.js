import AboutUsDetailPage from "./AboutUsDetailClient";
import { createMetadata } from "../../lib/seo";

const aboutPages = {
  company: {
    title: "Company Profile",
    description: "Learn about Loyalty Automation, its industrial automation profile, vision, mission, objectives, and company background.",
  },
  "registration-directors-info": {
    title: "Registration and Director Information",
    description: "View Loyalty Automation registration details, statutory company information, and current director information.",
  },
};

export function generateStaticParams() {
  return [
    { slug: "company" },
    { slug: "registration-directors-info" },
  ];
}

export function generateMetadata({ params }) {
  const page = aboutPages[params.slug] || aboutPages.company;

  return createMetadata({
    title: page.title,
    description: page.description,
    path: `/about-us/${params.slug}`,
  });
}

export default function Page() {
  return <AboutUsDetailPage />;
}

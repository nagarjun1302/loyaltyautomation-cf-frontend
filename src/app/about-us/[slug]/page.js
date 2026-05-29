import AboutUsDetailPage from "./AboutUsDetailClient";

export function generateStaticParams() {
  return [
    { slug: "company" },
    { slug: "registration-directors-info" },
  ];
}

export default function Page() {
  return <AboutUsDetailPage />;
}

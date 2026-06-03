export const siteName = "Loyalty Automation";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.loyaltyautomation.com";

export const publicRoutes = [
  "",
  "/about-us",
  "/about-us/company",
  "/about-us/registration-directors-info",
  "/channel-partners",
  "/channel-partners/delta",
  "/channel-partners/motovario",
  "/channel-partners/phoneix-contact",
  "/channel-partners/schneider-electric",
  "/customer/customervisit",
  "/service-support",
  "/solutions",
];

export function absoluteUrl(path = "") {
  return new URL(path, siteUrl).toString();
}

export function createMetadata({ title, description, path = "", image = "/logo123.png", type = "website" }) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

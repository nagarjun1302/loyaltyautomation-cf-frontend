import { absoluteUrl, publicRoutes } from "./lib/seo";

export const dynamic = "force-static";

export default function sitemap() {
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: "2026-06-03",
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

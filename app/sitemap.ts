import type { MetadataRoute } from "next";
import { departments, news } from "@/content/structure";
import { site } from "@/content/site";

const pages = [
  "", "/le-senat", "/organisation", "/bureau-executif", "/presidence", "/sous-groupes", "/commissions",
  "/territoires", "/actions", "/actualites", "/agenda", "/documents", "/transparence", "/rejoindre",
  "/engagement", "/partenaires", "/opportunites", "/contact", "/presse", "/mentions-legales", "/confidentialite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...departments.map((d) => ({ url: `${base}/territoires/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...news.map((n) => ({ url: `${base}/actualites/${n.slug}`, lastModified: n.iso, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}

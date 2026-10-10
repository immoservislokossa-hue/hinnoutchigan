import type { MetadataRoute } from "next";
import { departments } from "@/content/structure";
import { SITE_URL } from "@/lib/env";
import { getNews } from "@/lib/data";

export const revalidate = 3600;

const pages = [
  "", "/le-senat", "/organisation", "/bureau-executif", "/presidence", "/sous-groupes", "/commissions",
  "/territoires", "/actions", "/actualites", "/agenda", "/documents", "/transparence", "/rejoindre",
  "/engagement", "/partenaires", "/opportunites", "/contact", "/presse", "/mentions-legales", "/confidentialite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews();
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...departments.map((d) => ({ url: `${SITE_URL}/territoires/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...news.map((n) => ({ url: `${SITE_URL}/actualites/${n.slug}`, lastModified: n.iso, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}

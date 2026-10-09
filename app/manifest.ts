import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.short,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fdfbf5",
    theme_color: "#0d3318",
    lang: "fr",
    icons: [{ src: "/logo.jpg", sizes: "680x708", type: "image/jpeg" }],
  };
}

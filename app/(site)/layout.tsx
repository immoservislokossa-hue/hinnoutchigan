import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

// Les pages publiques lisent Supabase : régénération toutes les 5 minutes
// (et immédiatement après une modification depuis le back-office).
export const revalidate = 300;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
    </>
  );
}

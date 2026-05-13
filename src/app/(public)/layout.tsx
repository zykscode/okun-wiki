import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        {children}
      </main>
      <BottomNav />
      <Footer />
    </>
  );
}

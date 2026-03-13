import Navber from "@/app/ui/navbar"
import Footer from "@/app/ui/footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
      <Navber />
      {children}
      <Footer />
    </main>
  );
}
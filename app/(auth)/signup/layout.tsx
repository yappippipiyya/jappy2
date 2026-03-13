import Navber from "@/app/ui/navbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
      <Navber />
      {children}
    </main>
  );
}
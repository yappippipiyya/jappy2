// app/page.tsx
import { SignOutButton } from "@/app/ui/auth/signOutButton";
import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"

export default async function HomePage() {
  return (
    <>
      <Navber />
      <p>ログイン中</p>
      <SignOutButton />
      <Footer />
    </>
  );
}
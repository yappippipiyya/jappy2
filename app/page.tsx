// app/page.tsx
import { SignOutButton } from "@/app/ui/auth/signOutButton";
import Navber from "@/app/ui/navber"

export default async function HomePage() {
  return (
    <>
      <Navber />
      <p>ログイン中</p>
      <SignOutButton />
    </>
  );
}
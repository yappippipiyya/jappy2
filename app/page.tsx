// app/page.tsx
import { SignOutButton } from "@/app/ui/auth/signOutButton";
import Navver from "@/app/ui/navver"

export default async function HomePage() {
  return (
    <>
      <Navver />
      <p>ログイン中</p>
      <SignOutButton />
    </>
  );
}
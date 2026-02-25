// app/page.tsx
import { auth } from "@/auth";
import { SignOutButton } from "@/app/ui/auth/signOutButton";

export default async function HomePage() {
  return (
    <>
      <p>ログイン中</p>
      <SignOutButton />
    </>
  );
}
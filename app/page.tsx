// app/page.tsx
import { SignOutButton } from "@/app/ui/auth/signOutButton";
import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"
import { auth } from "@/auth";

import { fetchUser } from "@/app/lib/services/user"
import { fetchBands } from "@/app/lib/services/band"


export default async function HomePage() {
  const session = await auth()

  if ( !session?.user?.email) return;

  const user = await fetchUser(null, session.user.email)
  if ( !user ) return;

  const bands = await fetchBands(user.id)

  return (
    <>
      <Navber />

      <h1>バンド練確認</h1>
      <h1>バンド一覧</h1>
      <div className="m-9">
        {bands.map((b) => b.name)}
      </div>

      <Footer />
    </>
  );
}
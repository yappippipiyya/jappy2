import { auth } from "@/auth";
import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"

import { fetchBand, fetchBands, fetchBandUsers } from "@/app/lib/services/band"
import { fetchSchedules } from "@/app/lib/services/schedule"

import { Header } from "@/app/ui/band/header";
import { BandContent } from "@/app/ui/band/bandContent";
import { notFound } from "next/navigation";
import { fetchUser } from "@/app/lib/services/user";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = params.id;

  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return
  const bands = await fetchBands(user.id)

  const band = bands.find(b => b.token === token && b.creator_user_id === user.id)

  if (!band) return


  return (
    <main>
      <Navber />

      {band.name}

      <Footer />
    </main>
  );
}
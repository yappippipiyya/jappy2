import { auth } from "@/auth";
import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"

import { fetchBand, fetchBandUsers } from "@/app/lib/services/band"
import { fetchSchedules } from "@/app/lib/services/schedule"

import { Header } from "@/app/ui/band/header";
import { BandContent } from "@/app/ui/band/bandContent";
import { notFound } from "next/navigation";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = params.id;
  const band = await fetchBand(null, token)

  if ( !band ) return notFound()

  const [session, bandUsers, schedules] = await Promise.all([
    auth(),
    fetchBandUsers(band.id),
    fetchSchedules(null, band.id)
  ]);

  const userEmail = session?.user?.email || ""

  if (!userEmail || !bandUsers.some(u => u.email === userEmail)) {
    return notFound();
  }

  const currentUser = bandUsers.find(u => u.email === userEmail);
  const isBandCreator = band.creator_user_id === currentUser?.id;

  const isArchived = band.archived || false

  return (
    <main>
      <Navber />

      <div className="-mt-10 pt-10 pb-15 bg-zinc-50 dark:bg-zinc-950">
        <Header band={band} isCreator={isBandCreator} isArchived={isArchived} />
        <BandContent band={band} schedules={schedules} bandUsers={bandUsers}/>
      </div>

      <Footer />
    </main>
  );
}
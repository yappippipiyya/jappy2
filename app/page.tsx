import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"
import { Bands } from "@/app/ui/home/bands"
import { ScheduleCheck } from "@/app/ui/home/scheduleCheck"
import { auth } from "@/auth";

import { fetchUser } from "@/app/lib/services/user"
import { fetchBands } from "@/app/lib/services/band"

export default async function HomePage() {
  const session = await auth()

  if ( !session?.user?.email ) return null;

  const user = await fetchUser(null, session.user.email)
  if ( !user ) return null;

  const bands = await fetchBands(user.id)

  return (
    <>
      <Navber />

      <div className="-mt-10 pt-10 bg-zinc-50 dark:bg-zinc-950">
        <div>
          <h1 className="text-xl font-bold tracking-tight mt-5 ml-5 -mb-3">バンド練確認</h1>
          <ScheduleCheck />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight mt-3 ml-5 -mb-3">バンド一覧</h1>
          <Bands userId={ user.id } />
       </div>
      </div>

      <Footer />
    </>
  );
}
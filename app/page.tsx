import { auth } from "@/auth";

import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"
import { CreateButton } from "@/app/ui/home/createButton"
import { ScheduleCheck } from "@/app/ui/home/scheduleCheck"
import { Bands } from "@/app/ui/home/bands"

import { fetchUser } from "@/app/lib/services/user"
import { fetchBands } from "@/app/lib/services/band"

export default async function HomePage() {
  const session = await auth()

  if ( !session?.user?.email ) return null;

  const user = await fetchUser(null, session.user.email)
  if ( !user ) return null;

  const bands = await fetchBands(user.id)

  return (
    <main>
      <Navber />

      <div className="-mt-10 pt-10 pb-15 bg-zinc-50 dark:bg-zinc-950">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mt-5 ml-5 -mb-2">バンド練確認</h1>
          <ScheduleCheck />
        </div>

        <div>
          <div className="relative flex items-center justify-between mt-3 ml-5 -mb-2">
            <h1 className="text-2xl font-bold tracking-tight">バンド一覧</h1>
            <CreateButton />
          </div>
          <Bands userId={ user.id } />
       </div>
      </div>

      <Footer />
    </main>
  );
}
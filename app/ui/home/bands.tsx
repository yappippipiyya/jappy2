import { fetchBands, fetchBandUsers } from "@/app/lib/services/band"

export async function Bands( { userId }: { userId: number }) {
  const bands = await fetchBands(userId)

  const bandsWithUsers = await Promise.all(
    bands.map(async (b) => {
      const users = await fetchBandUsers(b.id)
      return { ...b, users}
    })
  )

  return (
    <div className="">
      {bandsWithUsers.map((b) => (
        <div key={b.id} className="m-5">
          <div>{b.name}</div>
          <div>{b.users.map(u => u.name).join("・")}</div>
        </div>
      ))}
    </div>
  )
}
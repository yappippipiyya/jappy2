import { Band } from "@/app/lib/types"
import { KebabMenu } from "./kebabMenu";


export async function Header(
  { band, isCreator, isArchived }: { band: Band, isCreator: boolean, isArchived: boolean }
) {
  return (
    <div className="">
      <div className="relative flex justify-center items-center">
        <div className="m-7 flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight ">
            {band.name}
          </h1>
          {band.archived && (
            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
            ARCHIVED
            </span>
          )}
        </div>
        <KebabMenu band={band} isCreator={isCreator} isArchived={isArchived} />
      </div>

      <div className="text-center">
        <div>
          <span className="font-bold">期間：</span>
          {band.start_date?.replaceAll("-", "/")} ～ {band.end_date?.replaceAll("-", "/")}
        </div>
        <div>
          <span className="font-bold">時間：</span>
          {`${Number(band.start_time?.slice(0, 2))}:00`} ～ {`${Number(band.end_time?.slice(0, 2))+1}:00`}
        </div>
      </div>

      <div className="m-5 text-center text-zinc-500">
        <p>各時間帯に参加可能なメンバーの人数です</p>
        <p>各マスにカーソルを合わせるかタップすると、メンバーが表示されます</p>
      </div>



    </div>
  )
}
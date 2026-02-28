import { Band } from "@/app/lib/types"
import { KebabMenu } from "./kebabMenu";


export async function Header(
  { band, isCreator, isArchived }: { band: Band, isCreator: boolean, isArchived: boolean }
) {
  const formatTime = (timeStr: string | null) => timeStr?.slice(0, 5) || "";

  return (
    <div className="">
      <div className="relative flex justify-center items-center">
        <h1 className="m-7 text-2xl font-bold tracking-tight ">
          {band.name}
        </h1>
        <KebabMenu isCreator={isCreator} isArchived={isArchived} />
      </div>

      <div className="text-center">
        <div>
          <span className="font-bold">期間：</span>
          {band.start_date?.replaceAll("-", "/")} ～ {band.end_date?.replaceAll("-", "/")}
        </div>
        <div>
          <span className="font-bold">時間：</span>
          {formatTime(band.start_time)} ～ {formatTime(band.end_time)}
        </div>
      </div>

      <div className="m-5 text-center text-zinc-500">
        <p>各時間帯に参加可能なメンバーの人数です</p>
        <p>各マスにカーソルを合わせるかタップすると、メンバーが表示されます</p>
      </div>



    </div>
  )
}
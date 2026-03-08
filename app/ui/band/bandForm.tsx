"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createBand, updateBand } from "@/app/lib/actions/band";
import { Band } from "@/app/lib/types";


export default function bandForm({ band }: { band: Band | null }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;
    const startTime = formData.get("start_time") as string;
    const endTime = formData.get("end_time") as string;

    if (startDate >= endDate) {
      toast.info("開始日は終了日より前の日付にしてください。");
      return
    }

    if (startTime >= endTime) {
      toast.info("開始時間は終了時間より前の時刻にしてください。");
      return;
    }

    setIsPending(true);

    if (band) {
      const res = await updateBand(band.id, {
        name: name,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
      });
      if (res) {
        router.refresh();
        router.push(`/band/${band.token}`);
        toast.success("更新が完了しました。")
      } else {
        toast.error("更新に失敗しました。");
        setIsPending(false);
      }

    } else {
      const res = await createBand(name, startDate, endDate, startTime, endTime)
      if (res) {
        router.refresh();
        router.push(`/band/${res.token}`);
        toast.success(`${name}を作成しました！`)
      } else {
        toast.error("作成に失敗しました");
        setIsPending(false);
      }
    }
  }

  const inputStyles = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none transition-all dark:scheme-dark appearance-none";
  const labelStyles = "block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5";

  const defaultValues = {
    name: band?.name ?? "",
    startDate: band?.start_date ?? "",
    endDate: band?.end_date ?? "",
    startTime: band?.start_time ? `${band.start_time.slice(0, 2)}:00` : "08:00",
    endTime: band?.end_time ? `${band.end_time.slice(0, 2)}:00` : "19:00",
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelStyles}>バンド名</label>
        <input name="name" type="text" required defaultValue={defaultValues.name} placeholder="例: The Awesome Band" className={inputStyles} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>開始日</label>
          <input name="start_date" type="date" required defaultValue={defaultValues.startDate} className={inputStyles} />
        </div>
        <div>
          <label className={labelStyles}>終了日</label>
          <input name="end_date" type="date" required defaultValue={defaultValues.endDate} className={inputStyles} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>開始時間</label>
          <div className="relative">
            <select name="start_time" required defaultValue={defaultValues.startTime} className={inputStyles}>
              {hours.map((h) => (
                <option key={h} value={h}>{Number(h.slice(0, 2))}時台から</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 material-icons text-sm">expand_more</span>
          </div>
        </div>
        <div>
          <label className={labelStyles}>終了時間</label>
          <div className="relative">
            <select name="end_time" required defaultValue={defaultValues.endTime} className={inputStyles}>
              {hours.map((h) => (
                <option key={h} value={h}>{Number(h.slice(0, 2))}時台まで</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 material-icons text-sm">expand_more</span>
          </div>
            <p className="mt-1 text-xs text-zinc-500">注："19時台まで"＝ 19:00～20:00</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {
        isPending
          ? (!band) ? "作成中..." : "更新中..."
          : (!band) ? "バンドを作成する" : "更新する"
        }
      </button>
    </form>
  );
}
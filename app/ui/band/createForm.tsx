"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBand } from "@/app/lib/actions/band";


export default function CreateBandForm({ userId }: { userId: number }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;
    const startTime = formData.get("start_time") as string;
    const endTime = formData.get("end_time") as string;

    if (startDate >= endDate) {
      alert("開始日は終了日より前の日付にしてください。");
      return
    }

    if (startTime >= endTime) {
      alert("開始時間は終了時間より前の時刻にしてください。");
      return;
    }

    setIsPending(true);

    const res = await createBand(
      formData.get("name") as string,
      startDate,
      endDate,
      startTime,
      endTime,
      userId
    );

    if (res) {
      router.refresh();
      router.push(`/band/${res.token}`);
    } else {
      alert("作成に失敗しました");
      setIsPending(false);
    }
  }

  const inputStyles = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none transition-all dark:scheme-dark appearance-none";
  const labelStyles = "block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelStyles}>バンド名</label>
        <input name="name" type="text" required placeholder="例: The Awesome Band" className={inputStyles} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>開始日</label>
          <input name="start_date" type="date" required className={inputStyles} />
        </div>
        <div>
          <label className={labelStyles}>終了日</label>
          <input name="end_date" type="date" required className={inputStyles} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>開始時間</label>
          <div className="relative">
            <select name="start_time" required className={inputStyles}>
              {hours.map((h) => {
                const hour = `${String(h).padStart(2, '0')}:00`;
                return (
                <option key={hour} value={hour}>{h}時台から</option>
              )})}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 material-icons text-sm">expand_more</span>
          </div>
        </div>
        <div>
          <label className={labelStyles}>終了時間</label>
          <div className="relative">
            <select name="end_time" required className={inputStyles}>
              {hours.map((h) => {
                const hour = `${String(h + 1).padStart(2, '0')}:00`;
                return (
                <option key={hour} value={hour}>{h}時台まで</option>
              )})}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 material-icons text-sm">expand_more</span>
          </div>
            <p className="mt-1 text-xs text-zinc-500">注："21時台まで"＝ 21:00～22:00</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? "作成中..." : "バンドを作成する"}
      </button>
    </form>
  );
}
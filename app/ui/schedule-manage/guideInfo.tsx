export function GuideInfo({ selectedBandId }: { selectedBandId: number }) {
  const isDefault = selectedBandId === 0;

  if (isDefault) {
    return (
      <div className="mx-5 mb-4">
        <div className="flex items-start gap-3 px-4 py-3 mt-6 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
          <span className="material-symbols-outlined text-sky-500 dark:text-sky-400 text-[20px] mt-0.5 shrink-0">info</span>
          <div className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed">
            <p>予定入力後、各バンドにて<span className="font-bold">「デフォルトを適用」</span>を忘れずにお願いします</p>
            <p className="mt-1 flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-emerald-300/70 shrink-0" />
              バンド練が入っている時間帯
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-5 mb-4">
      <div className="flex items-start gap-3 px-4 py-3 mt-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-[20px] mt-0.5 shrink-0">palette</span>
        <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-pink-200/70 shrink-0" />
              <span>このバンドのバンド練</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-emerald-200/70 shrink-0" />
              <span>他のバンドのバンド練</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-sky-200 dark:bg-sky-400/30 shrink-0" />
              <span>デフォルトで参加可能</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

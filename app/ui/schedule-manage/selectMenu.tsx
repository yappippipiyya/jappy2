export function SelectMenu({ selectedBandId, setSelectedBandId, bandNameMap }: {
  selectedBandId: number, setSelectedBandId: (m: number) => void, bandNameMap: Record<number, string>
}) {
  return (
    <div className="flex items-center justify-center my-5">
      <div className="relative">
        <select
          value={selectedBandId}
          onChange={(e) => setSelectedBandId(Number(e.target.value))}
          className="appearance-none pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-sm transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer"
        >
          {Object.entries(bandNameMap).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-[20px] pointer-events-none">
          tune
        </span>
        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-[18px] pointer-events-none">
          expand_more
        </span>
      </div>
    </div>
  )
}
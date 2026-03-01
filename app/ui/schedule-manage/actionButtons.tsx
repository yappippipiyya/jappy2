export function ActionButtons({ selectedBandId, bandNameMap }: {
  selectedBandId: number, bandNameMap: Record<number, string>
}) {
  const isDefault = selectedBandId === 0
  return (
    <>
      <div className="flex">
        <button>デフォルトを適用</button>
        <button>
          <span className="material-icons">more_horiz</span>
        </button>
      </div>
    </>
  )
}
export function SelectMenu({ selectedBandId, setSelectedBandId, bandNameMap }: {
  selectedBandId: number, setSelectedBandId:  (m: number) => void, bandNameMap: Record<number, string>
}) {
  return (
    <>
      <select
        value={selectedBandId}
        onChange={(e) => setSelectedBandId(Number(e.target.value))}
      >
        {Object.entries(bandNameMap).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </>
  )
}
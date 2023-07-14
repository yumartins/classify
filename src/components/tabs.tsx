import type { Dispatch, SetStateAction } from "react"

interface TabsProps {
  data: string[]
  selected: boolean
  onSelected: Dispatch<SetStateAction<string>>
}

export default function Tabs({ data, selected, onSelected }: TabsProps) {
  return (
    <div className="flex items-center gap-2">
      {data.map((field) => (
        <button
          key={field}
          type="button"
          onClick={() => onSelected(field)}
          className="bg-white py-1 px-3 rounded-lg text-gray-500"
        >
          {field}
        </button>
      ))}
    </div>
  )
}

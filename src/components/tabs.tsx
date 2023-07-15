import type { Dispatch, HTMLAttributes, SetStateAction } from "react"

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  data: string[]
  selected: string
  onSelected: Dispatch<SetStateAction<string>>
}

export default function Tabs({
  data,
  selected,
  className,
  onSelected,
  ...rest
}: TabsProps) {
  return (
    <div
      {...rest}
      className={`flex items-center w-fit rounded-lg p-2 gap-2 bg-gray-50 ${
        className || ""
      }`}
    >
      {data.map((field) => (
        <button
          key={field}
          type="button"
          onClick={() => onSelected(field)}
          className={`py-1 px-3 text-sm rounded transition-all duration-300 ease-in-out ${
            selected === field
              ? "bg-white text-blue-500"
              : "bg-transparent text-gray-500 hover:text-blue-500"
          }`}
        >
          {field}
        </button>
      ))}
    </div>
  )
}

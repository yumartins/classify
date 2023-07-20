import type { SelectHTMLAttributes } from "react"
import { useFormContext } from "react-hook-form"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  label: string
  options: string[]
}

export default function Select({ name, label, options, ...rest }: SelectProps) {
  const {
    register,
    formState: { defaultValues },
  } = useFormContext()

  return (
    <div className="flex flex-col gap-0.5">
      <label
        htmlFor={name}
        className="text-xs cursor-default font-medium text-gray-600"
      >
        {label}
      </label>

      <select
        {...rest}
        {...register(name)}
        name={name}
        className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-200 appearance-none outline-none rounded-lg placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out hover:border-gray-300"
        defaultValue={defaultValues?.[name]}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

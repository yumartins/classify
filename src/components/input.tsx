import { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ name, label, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600" htmlFor={name}>
        {label}
      </label>
      <input
        {...rest}
        name={name}
        className="w-full px-6 py-3 text-gray-900 bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
      />
    </div>
  )
}

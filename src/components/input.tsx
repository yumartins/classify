import type { InputHTMLAttributes } from "react"
import { useFormContext } from "react-hook-form"

import { masks } from "../utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  mask?: "DATE" | "PHONE" | "CURRENCY"
  label: string
}

export default function Input({
  name,
  mask,
  label,
  className,
  ...rest
}: InputProps) {
  const {
    register,
    formState: { defaultValues },
  } = useFormContext()

  return (
    <div className={`flex flex-col gap-0.5 w-full ${className || ""}`}>
      <label
        htmlFor={name}
        className="text-xs cursor-default font-medium text-gray-600"
      >
        {label}
      </label>

      <input
        {...rest}
        {...register(name)}
        name={name}
        onChange={(e) => {
          let message = e.target.value

          switch (mask) {
            case "DATE":
              message = masks.date(message)
              break

            case "PHONE":
              message = masks.phone(message)
              break

            case "CURRENCY":
              message = masks.money(message)
              break

            default:
              break
          }

          e.target.value = message

          if (register) register(name).onChange(e)
        }}
        className="w-full !px-4 !py-2 !text-gray-800 bg-white border !border-gray-200 appearance-none !outline-none !rounded-lg !placeholder:text-gray-400 !text-sm transition-all duration-300 ease-in-out hover:!border-gray-300"
        defaultValue={defaultValues?.[name]}
      />
    </div>
  )
}

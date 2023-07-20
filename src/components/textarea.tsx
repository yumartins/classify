import type { TextareaHTMLAttributes } from "react"
import { useFormContext } from "react-hook-form"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label: string
}

export default function Textarea({ name, label, ...rest }: TextareaProps) {
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

      <textarea
        {...rest}
        {...register(name)}
        name={name}
        className="w-full font-sans resize-none px-4 py-2 text-gray-800 bg-white border border-gray-200 appearance-none outline-none rounded-lg placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out hover:border-gray-300"
        defaultValue={defaultValues?.[name]}
      />
    </div>
  )
}

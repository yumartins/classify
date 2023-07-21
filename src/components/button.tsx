import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
}

const variants = {
  primary:
    "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600",
  secondary:
    "bg-white text-gray-500 border-gray-200 hover:text-gray-600 hover:border-gray-300",
}

export default function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`border border-solid text-sm outline-none py-2 px-4 rounded-lg transition-all duration-300 ease-in-out ${
        variants[variant as keyof typeof variants]
      } ${className || ""}`}
    >
      {children}
    </button>
  )
}

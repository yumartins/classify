import type { ButtonHTMLAttributes } from "react"

export default function Button({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`bg-blue-500 py-2 px-4 rounded-lg text-white transition-all duration-300 ease-in-out hover:bg-blue-600 ${
        className || ""
      }`}
    >
      {children}
    </button>
  )
}

function currency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function date(text: string) {
  return text
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1")
}

function money(text: string) {
  const onlyDigits = text
    .split("")
    .filter((s) => /\d/.test(s))
    .join("")
    .padStart(3, "0")

  const digitsFloat = `${onlyDigits.slice(0, -2)}.${onlyDigits.slice(-2)}`

  return currency(Number(digitsFloat))
}

function clear(text: string): string | number {
  const replace = text.replace(/\D/g, "")

  if (typeof replace === "string") return Number(replace)

  return replace
}

function phone(text: string) {
  return text
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1")
}

export default {
  date,
  money,
  clear,
  phone,
}

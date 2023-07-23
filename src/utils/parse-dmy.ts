export default function parseDMY(date: string) {
  const [day, month, year] = date.split(/\D/)

  return new Date(Number(year), Number(month) - 1, Number(day))
}

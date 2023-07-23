export default function reverse(data: Record<string, string>) {
  const flipped = Object.entries(data).map(([key, value]) => [value, key])

  return Object.fromEntries(flipped)
}

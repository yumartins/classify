import "@/styles/main.scss"

import { Toaster } from "react-hot-toast"

export default function App() {
  return (
    <div className="mt-6 flex flex-col bg-white p-6 rounded-lg border border-solid border-gray-200">
      <h1>Detail</h1>

      <Toaster position="bottom-right" />
    </div>
  )
}

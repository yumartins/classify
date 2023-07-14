import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./app.tsx"

const root = document.getElementById("classify-configuration") as HTMLElement

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)

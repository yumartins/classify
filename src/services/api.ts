import axios from "axios"

export default axios.create({
  baseURL: `${window.location.origin}/wp-json`,
  headers: {
    "Content-Type": "application/json",
  },
})

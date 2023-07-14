import axios from "axios"

export default axios.create({
  baseURL: `${window.location.origin}/wordpress/wp-json/classify`,
  headers: {
    "Content-Type": "application/json",
  },
})

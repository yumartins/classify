import "@/styles/main.scss"

import { useEffect, useState } from "react"
import { FormLayout, formSchema } from "@/layouts"
import { reverseObject } from "@/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import type { ImageType } from "react-images-uploading"
import { z } from "zod"

import { fontType, logoType, numberOfColumns } from "../data"

const initialFields = {
  body: "Normal",
  logo: [] as ImageType[],
  title: "Negrito",
  gallery: [] as ImageType[],
  logoType: "Logo de 2cm",
  subscriber: "Não",
  numberOfColumns: "1 coluna",
}

type FormSchemaType = z.infer<typeof formSchema>

type FormFile = {
  name: string
  path: string
}

export default function App() {
  const [form, setForm] = useState(initialFields)
  const [amount, setAmount] = useState<string | null>(null)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    const media = window.sessionStorage.getItem("classify-media")
    const session = window.sessionStorage.getItem("classify-form")

    if (media) {
      const parse = JSON.parse(media) as FormFile[]

      const logo = parse.find(({ name }) => name.includes("logo-"))
      const gallery = parse.filter(({ name }) => !name.includes("logo-"))

      // setFiles({
      //   logo: logo || null,
      //   gallery,
      // })
    }

    if (session) {
      const parse = JSON.parse(session) as Record<string, string>

      const { city, state, street, number, neighborhood, ...rest } = parse

      Object.entries(rest).forEach(([key, value]) => {
        const formatter = () => {
          if (["endAt", "startAt"].includes(key))
            return format(new Date(value), "dd/MM/yyyy")

          if (key === "logoType") return reverseObject(logoType)[value]
          if (key === "bodyType") return reverseObject(fontType)[value]
          if (key === "titleType") return reverseObject(fontType)[value]
          if (key === "numberOfColumns")
            return reverseObject(numberOfColumns)[value]

          return value
        }

        methods.setValue(key as keyof FormSchemaType, formatter())
      })
    }
  }, [methods])

  return (
    <div className="classify mt-4 flex flex-col gap-4">
      <FormLayout
        form={form}
        amount={amount}
        methods={methods}
        setForm={setForm}
        setAmount={setAmount}
      />

      <Toaster position="bottom-right" />
    </div>
  )
}

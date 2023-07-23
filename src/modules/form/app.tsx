import "@/styles/main.scss"

import { useState } from "react"
import { FormLayout, formSchema } from "@/layouts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import { type ImageType } from "react-images-uploading"
import { z } from "zod"

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

export default function App() {
  const [form, setForm] = useState(initialFields)
  const [amount, setAmount] = useState<string | null>(null)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })

  return (
    <div className="classify flex flex-col bg-white p-8 rounded-lg border border-solid border-gray-200">
      <span className="text-xs text-gray-400 uppercase">Classificados</span>
      <h2 className="!text-2xl text-gray-800 !font-semibold">Anuncie agora</h2>
      <p className="text-sm !mt-1 !mb-6 text-gray-500">
        Calcule agora mesmo, é rápido e fácil.
      </p>

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

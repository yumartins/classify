import "@/styles/main.scss"

import { useEffect, useState } from "react"
import { Input, Textarea } from "@/components"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import { z } from "zod"

import { staticFields } from "./data"

const initialFields = {
  city: "",
  email: "",
  phone: "",
  state: "",
  street: "",
  number: "",
  category: "",
  neighborhood: "",
}

const schema = z.object({
  body: z.string().nonempty("Digite o corpo do anúncio"),
  title: z.string().nonempty("Digite o título do anúncio"),
  endAt: z.string().nonempty("Digite a data de fim do anúncio"),
  startAt: z.string().nonempty("Digite a data de início do anúncio"),
})

type FormSchemaType = z.infer<typeof schema>

type FormFile = {
  name: string
  path: string
}

type Files = {
  logo: FormFile | null
  gallery: FormFile[]
}

export default function App() {
  const [data, setData] = useState(initialFields)
  const [files, setFiles] = useState<Files | null>(null)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const media = window.sessionStorage.getItem("classify-media")
    const session = window.sessionStorage.getItem("classify-form")

    if (media) {
      const parse = JSON.parse(media) as FormFile[]

      const logo = parse.find(({ name }) => name.includes("logo-"))
      const gallery = parse.filter(({ name }) => !name.includes("logo-"))

      setFiles({
        logo: logo || null,
        gallery,
      })
    }

    if (session) {
      const parse = JSON.parse(session) as Record<string, string>

      const {
        city,
        state,
        email,
        phone,
        street,
        number,
        category,
        neighborhood,
        ...rest
      } = parse

      setData({
        city: city || "",
        state: state || "",
        email: email || "",
        phone: phone || "",
        street: street || "",
        number: number || "",
        category: category || "",
        neighborhood: neighborhood || "",
      })

      Object.entries(rest).forEach(([key, value]) => {
        methods.setValue(key as keyof FormSchemaType, value)
      })
    }
  }, [methods])

  function onSubmit(data: FormSchemaType) {
    console.log({ data })
  }

  return (
    <div className="classify mt-4 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {staticFields.map(({ key, name }) => (
          <div key={key} className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-400">{name}</p>

            <p className="text-sm font-bold text-gray-800">
              {data[key as keyof typeof data] || "-"}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {files?.logo && (
          <div className="col-span-1 flex flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-400">Logo</p>

            <img
              src={files.logo.path}
              alt=""
              className="rounded-lg w-full object-contain"
            />
          </div>
        )}

        {files?.gallery && (
          <div className="col-span-2 flex flex-col gap-0.5">
            <p className="text-xs font-medium text-gray-400">Fotos (Digital)</p>

            <div className="grid grid-cols-3 gap-2">
              {files.gallery.map(({ name, path }) => (
                <img
                  src={path}
                  key={name}
                  alt=""
                  className="rounded-lg w-full object-contain max-h-60"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            name="title"
            label="Título"
            disabled
            placeholder="Digite o título do anúncio"
          />

          <Textarea
            name="body"
            rows={5}
            label="Corpo"
            disabled
            placeholder="Digite o texto docorpo do anúncio"
          />

          <div className="flex items-center gap-4">
            <Input
              name="startAt"
              mask="DATE"
              label="Data de início"
              disabled
              className="w-full"
              placeholder="Digite a data de início do anúncio"
            />

            <Input
              name="endAt"
              mask="DATE"
              label="Data de fim"
              disabled
              className="w-full"
              placeholder="Digite a data de fim do anúncio"
            />
          </div>
        </form>
      </FormProvider>

      <Toaster position="bottom-right" />
    </div>
  )
}

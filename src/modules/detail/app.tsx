import "@/styles/main.scss"

import { useEffect, useState } from "react"
import { Input, Textarea } from "@/components"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import { z } from "zod"

const initialFields = {
  email: "",
  phone: "",
  category: "",
}

const schema = z.object({
  body: z.string().nonempty("Digite o corpo do anúncio"),
  title: z.string().nonempty("Digite o título do anúncio"),
  endAt: z.string().nonempty("Digite a data de fim do anúncio"),
  startAt: z.string().nonempty("Digite a data de início do anúncio"),
})

type FormSchemaType = z.infer<typeof schema>

export default function App() {
  const [data, setData] = useState(initialFields)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const session = window.sessionStorage.getItem("classify-form")

    if (session) {
      const parse = JSON.parse(session) as Record<string, string>

      const { email, phone, category, ...rest } = parse

      setData({
        email: email || "",
        phone: phone || "",
        category: category || "",
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
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-gray-400">E-mail</p>

          <p className="text-sm font-bold text-gray-800">{data.email}</p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-gray-400">Telefone</p>

          <p className="text-sm font-bold text-gray-800">{data.phone}</p>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-gray-400">Categoria</p>

          <p className="text-sm font-bold text-gray-800">{data.category}</p>
        </div>
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

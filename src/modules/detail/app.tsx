import "@/styles/main.scss"

import { useEffect } from "react"
import { Input } from "@/components"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import { z } from "zod"

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Digite um e-mail válido").optional(),
  phone: z.string().min(15, "Digite um telefone válido").optional(),
})

type FormSchemaType = z.infer<typeof schema>

export default function App() {
  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const session = window.sessionStorage.getItem("classify-form")

    if (session) {
      const parse = JSON.parse(session) as Record<string, string>

      Object.entries(parse).forEach(([key, value]) => {
        methods.setValue(key as keyof FormSchemaType, value)
      })
    }
  }, [methods])

  function onSubmit(data: FormSchemaType) {
    console.log({ data })
  }

  return (
    <div className="classify">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col mt-4 gap-4"
        >
          <Input
            name="email"
            label="E-mail"
            disabled
            placeholder="Digite seu e-mail"
          />

          <Input
            name="phone"
            mask="PHONE"
            label="Telefone"
            disabled
            placeholder="Digite seu telefone"
          />
        </form>
      </FormProvider>

      <Toaster position="bottom-right" />
    </div>
  )
}

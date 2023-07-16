import "@/styles/main.scss"

import { useState } from "react"
import { Button, Input } from "@/components"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import { z } from "zod"

const schema = z.object({
  name: z.string().nonempty("Digite seu nome completo"),
  email: z
    .string()
    .email("Digite um e-mail válido")
    .nonempty("Digite seu e-mail"),
  phone: z
    .string()
    .min(15, "Digite um telefone válido")
    .nonempty("Digite seu telefone"),
})

type FormSchemaType = z.infer<typeof schema>

export default function App() {
  const [loading, setLoading] = useState(false)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormSchemaType) {
    setLoading(true)

    console.log({ data })

    setLoading(false)
  }

  return (
    <div className="classify flex flex-col bg-white p-8 rounded-lg border border-solid border-gray-200">
      <span className="text-xs text-gray-400 uppercase">Classificados</span>
      <h2 className="!text-2xl text-gray-800 !font-semibold">Anuncie agora</h2>
      <p className="text-sm !mt-1 text-gray-500">
        Calcule agora mesmo, é rápido e fácil.
      </p>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col mt-6 gap-4"
        >
          <Input
            name="name"
            label="Nome completo"
            placeholder="Digite seu nome completo"
          />

          <Input name="email" label="E-mail" placeholder="Digite seu e-mail" />

          <Input
            name="phone"
            mask="PHONE"
            label="Telefone"
            placeholder="Digite seu telefone"
          />

          <Button type="submit" disabled={loading} className="mt-10 ml-auto">
            {loading ? "Salvando ..." : "Salvar informações"}
          </Button>
        </form>
      </FormProvider>

      <Toaster position="bottom-right" />
    </div>
  )
}

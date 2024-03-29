import "@/styles/main.scss"

import { useEffect, useState } from "react"
import { Button, Input, Tabs } from "@/components"
import { api } from "@/services"
import { masks } from "@/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { z } from "zod"

import { fields } from "./data"

const tabs = ["Balcão", "Telefone"]

const prayer = z.object({
  logo2cm: z.string().optional(),
  logo4cm: z.string().optional(),
  valuePerDay: z.string().optional(),
  valuePerImage: z.string().optional(),
  publicityNotice: z.string().optional(),
  churchInvitation: z.string().optional(),
  sectionSponsorship: z.string().optional(),
})

const printed = z.object({
  bold: z.string().optional(),
  regular: z.string().optional(),
  cursive: z.string().optional(),
  logo2cm: z.string().optional(),
  logo4cm: z.string().optional(),
  valuePerDay: z.string().optional(),
  valuePerLine: z.string().optional(),
  valuePerImage: z.string().optional(),
})

const schema = z.object({
  phone: printed,
  prayer,
  balcony: printed,
})

const currentTab = {
  Balcão: "balcony",
  Oração: "prayer",
  Telefone: "phone",
}

type FormSchemaType = z.infer<typeof schema>

export default function App() {
  const [tab, setTab] = useState(tabs[0])
  const [loading, setLoading] = useState(false)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const session = window.sessionStorage.getItem("classify-configuration")

    if (session) {
      const parse = JSON.parse(session) as Record<
        string,
        Record<string, number>
      >

      Object.entries(parse).forEach(([name, fields]) => {
        Object.entries(fields).forEach(([key, value]) => {
          methods.setValue(
            `${name}.${key}` as any,
            masks.money(value.toString())
          )
        })
      })
    }
  }, [methods])

  function onSubmit(data: FormSchemaType) {
    setLoading(true)

    const form = {} as Record<string, Record<string, number>>

    Object.entries(data).forEach(([name, fields]) => {
      form[name] = {}

      Object.entries(fields).forEach(([key, value]) => {
        form[name][key] = masks.clear(value) as number
      })
    })

    api
      .post("/classify/configuration", form)
      .then(() => toast.success("Configuração atualizada com sucesso."))
      .catch(() =>
        toast.error("Desculpe, não conseguimos registrar as informações.")
      )
      .finally(() => setLoading(false))
  }

  const option = currentTab[tab as keyof typeof currentTab]

  return (
    <div className="mt-6 flex flex-col bg-white p-6 rounded-lg border border-solid border-gray-200">
      <Tabs data={tabs} selected={tab} onSelected={setTab} />

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col mt-6"
        >
          {Object.entries(fields).map(([key, form]) => (
            <div
              key={key}
              className={`grid-cols-3 gap-4 ${
                key === option ? "grid" : "hidden"
              }`}
            >
              {form.map(({ name, ...rest }) => (
                <Input
                  {...rest}
                  key={name}
                  name={`${key}.${name}`}
                  mask="CURRENCY"
                />
              ))}
            </div>
          ))}

          <Button type="submit" disabled={loading} className="mt-10 ml-auto">
            {loading ? "Salvando ..." : "Salvar informações"}
          </Button>
        </form>
      </FormProvider>

      <Toaster position="bottom-right" />
    </div>
  )
}

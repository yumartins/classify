import "./styles/main.scss"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { Button, Input, Tabs } from "./components"
import { fields } from "./data"

const tabs = ["Balcão", "Telefone", "Oração"]

const prayer = z.object({
  logo2cm: z.string().optional(),
  logo4cm: z.string().optional(),
  valuePerDay: z.string().optional(),
  publicityNotice: z.string().optional(),
  churchInvitation: z.string().optional(),
  sectionSponsorship: z.string().optional(),
})

const printed = z.object({
  cursive: z.string().optional(),
  logo2cm: z.string().optional(),
  logo4cm: z.string().optional(),
  valuePerDay: z.string().optional(),
  valuePerLine: z.string().optional(),
  valuePerImage: z.string().optional(),
  boldLetterInTitle: z.string().optional(),
  regularLetterInTheBody: z.string().optional(),
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

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormSchemaType) {
    console.log(data)
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

          <Button type="submit" className="mt-10 ml-auto">
            Salvar informações
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}

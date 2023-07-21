import "@/styles/main.scss"

import { useMemo, useState } from "react"
import { Button, Input, Select, Tabs, Textarea, Upload } from "@/components"
import { api } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { type ImageListType, type ImageType } from "react-images-uploading"
import { z } from "zod"

import { fontType, logoType, numberOfCaracteresByFontType } from "../data"
import { categories } from "./data"

const schema = z.object({
  name: z.string().nonempty("Digite seu nome completo"),
  body: z.string().nonempty("Digite o corpo do anúncio"),
  email: z
    .string()
    .email("Digite um e-mail válido")
    .nonempty("Digite seu e-mail"),
  phone: z
    .string()
    .min(15, "Digite um telefone válido")
    .nonempty("Digite seu telefone"),
  title: z.string().nonempty("Digite o título do anúncio"),
  endAt: z.string().nonempty("Digite a data de fim do anúncio"),
  startAt: z.string().nonempty("Digite a data de início do anúncio"),
  category: z.string().nonempty("Selecione a categoria do anúncio"),
})

type FormSchemaType = z.infer<typeof schema>

const initialFields = {
  body: "Normal",
  logo: [] as ImageType[],
  title: "Negrito",
  gallery: [] as ImageType[],
  logoType: "Logo de 2cm",
}

export default function App() {
  const [form, setForm] = useState(initialFields)
  const [loading, setLoading] = useState(false)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  function onFile(type: "logo" | "gallery", imageList: ImageListType) {
    setForm((prev) => ({ ...prev, [type]: imageList }))
  }

  async function onSubmit(data: FormSchemaType) {
    setLoading(true)

    const fields = {
      ...data,
      bodyType: fontType[form.body as keyof typeof fontType],
      titleType: fontType[form.title as keyof typeof fontType],
    }

    api
      .post("/classify/form", fields)
      .then(() => toast.success("Anúncio enviado com sucesso."))
      .catch(() => toast.error("Desculpe, não conseguimos enviar o anúncio."))
      .finally(() => setLoading(false))
  }

  const body = methods.watch("body")
  const title = methods.watch("title")

  const numberOfLines = useMemo(() => {
    const numberOfCaracteresBody =
      numberOfCaracteresByFontType[
        fontType[
          form.body as keyof typeof fontType
        ] as keyof typeof numberOfCaracteresByFontType
      ]
    const numberOfCaracteresTitle =
      numberOfCaracteresByFontType[
        fontType[
          form.title as keyof typeof fontType
        ] as keyof typeof numberOfCaracteresByFontType
      ]

    return {
      body:
        body?.length > 0
          ? Math.round(body.length / numberOfCaracteresBody) + 1
          : 0,
      title:
        title?.length > 0
          ? Math.round(title.length / numberOfCaracteresTitle) + 1
          : 0,
    }
  }, [form, body, title])

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

          <Select
            name="category"
            label="Categoria"
            options={categories}
            placeholder="Selecione a categoria"
          />

          <div className="flex flex-col gap-2">
            <Input
              name="title"
              label="Título"
              placeholder="Digite o título do anúncio"
            />

            <div className="flex items-center justify-between">
              <Tabs
                data={Object.keys(fontType)}
                selected={form.title}
                onSelected={(value) =>
                  setForm((prev) => ({ ...prev, title: value }))
                }
              />

              <p className="text-sm text-gray-500">
                {`Número de linhas: ${numberOfLines.title || 0}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Textarea
              name="body"
              rows={5}
              label="Corpo"
              placeholder="Digite o texto docorpo do anúncio"
            />

            <div className="flex items-center justify-between">
              <Tabs
                data={Object.keys(fontType)}
                selected={form.body}
                onSelected={(value) =>
                  setForm((prev) => ({ ...prev, body: value }))
                }
              />

              <p className="text-sm text-gray-500">
                {`Número de linhas: ${numberOfLines.body || 0}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Input
              name="startAt"
              mask="DATE"
              label="Data de início"
              className="w-full"
              placeholder="Digite a data de início do anúncio"
            />

            <Input
              name="endAt"
              mask="DATE"
              label="Data de fim"
              className="w-full"
              placeholder="Digite a data de fim do anúncio"
            />
          </div>

          <Upload
            label="Logo"
            value={form.logo}
            onChange={(value) => onFile("logo", value)}
          >
            <Tabs
              data={Object.keys(logoType)}
              selected={form.logoType}
              onSelected={(value) =>
                setForm((prev) => ({ ...prev, logoType: value }))
              }
            />
          </Upload>

          <Upload
            label="Fotos (Apenas para Digital)"
            value={form.gallery}
            multiple
            onChange={(value) => onFile("gallery", value)}
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

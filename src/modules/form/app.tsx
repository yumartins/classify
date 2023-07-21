import "@/styles/main.scss"

import { useMemo, useState } from "react"
import { Button, Input, Select, Tabs, Textarea, Upload } from "@/components"
import { api } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { type ImageListType, type ImageType } from "react-images-uploading"
import { z } from "zod"

import {
  fontType,
  logoType,
  numberOfCaracteresByFontType,
  numberOfColumns,
} from "../data"
import { categories } from "./data"
import schema from "./schema"

type FormSchemaType = z.infer<typeof schema>

const initialFields = {
  body: "Normal",
  logo: [] as ImageType[],
  title: "Negrito",
  gallery: [] as ImageType[],
  logoType: "Logo de 2cm",
  subscriber: "Não",
  numberOfColumns: "1 coluna",
}

export default function App() {
  const [form, setForm] = useState(initialFields)
  const [loading, setLoading] = useState<"CALCULATE" | "SUBMIT" | null>(null)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  function onFile(type: "logo" | "gallery", imageList: ImageListType) {
    setForm((prev) => ({ ...prev, [type]: imageList }))
  }

  async function onSubmit(data: FormSchemaType) {
    setLoading("SUBMIT")

    const { address, ...rest } = data

    const fields = {
      ...rest,
      ...address,
      bodyType: fontType[form.body as keyof typeof fontType],
      logoType: logoType[form.logoType as keyof typeof logoType],
      titleType: fontType[form.title as keyof typeof fontType],
      subscriber: form.subscriber === "Sim",
      numberOfColumns:
        numberOfColumns[form.numberOfColumns as keyof typeof numberOfColumns],
    }

    api
      .post("/classify/form", fields)
      .then(() => toast.success("Anúncio enviado com sucesso."))
      .catch(() => toast.error("Desculpe, não conseguimos enviar o anúncio."))
      .finally(() => setLoading(null))
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

          <Input
            name="address.street"
            label="Rua"
            placeholder="Digite seu endereço"
          />

          <div className="flex items-center gap-4">
            <Input
              name="address.number"
              label="Número"
              placeholder="Digite o número do endereço"
            />

            <Input
              name="address.neighborhood"
              label="Bairro"
              placeholder="Digite o bairro do endereço"
            />
          </div>

          <div className="flex items-center gap-4">
            <Input
              name="address.city"
              label="Cidade"
              placeholder="Digite sua cidade"
            />

            <Input
              name="address.state"
              label="Estado"
              maxLength={2}
              placeholder="Digite seu estado"
            />
          </div>

          <Select
            name="category"
            label="Categoria"
            options={categories}
            placeholder="Selecione a categoria"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs cursor-default font-medium text-gray-600">
                É Assinante?
              </p>

              <Tabs
                data={["Sim", "Não"]}
                selected={form.subscriber}
                onSelected={(value) =>
                  setForm((prev) => ({ ...prev, subscriber: value }))
                }
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="text-xs cursor-default font-medium text-gray-600">
                Número de colunas
              </p>

              <Tabs
                data={Object.keys(numberOfColumns)}
                selected={form.numberOfColumns}
                onSelected={(value) =>
                  setForm((prev) => ({ ...prev, numberOfColumns: value }))
                }
              />
            </div>
          </div>

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
              placeholder="Digite a data de início do anúncio"
            />

            <Input
              name="endAt"
              mask="DATE"
              label="Data de fim"
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

          <div className="flex mt-10 items-center justify-end gap-4">
            <Button
              type="button"
              disabled={loading === "CALCULATE"}
              variant="secondary"
            >
              {loading === "CALCULATE" ? "Calculando ..." : "Calcular"}
            </Button>

            <Button type="submit" disabled={loading === "SUBMIT"}>
              {loading === "SUBMIT" ? "Enviando ..." : "Enviar informações"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <Toaster position="bottom-right" />
    </div>
  )
}

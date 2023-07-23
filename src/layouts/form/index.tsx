import {
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react"
import { Button, Input, Select, Tabs, Textarea, Upload } from "@/components"
import {
  fontType,
  logoType,
  numberOfCaracteresByFontType,
  numberOfColumns,
  origemType,
} from "@/modules/data"
import { api } from "@/services"
import { masks, parseDMY } from "@/utils"
import { FormProvider, type UseFormReturn } from "react-hook-form"
import toast from "react-hot-toast"
import type { ImageListType, ImageType } from "react-images-uploading"
import { z } from "zod"

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

type Form = {
  body: string
  logo: ImageType[]
  title: string
  gallery: ImageType[]
  logoType: string
  subscriber: string
  numberOfColumns: string
}

interface FormProps extends PropsWithChildren {
  form: Form
  amount: string | null
  methods: UseFormReturn<FormSchemaType>
  setForm: Dispatch<SetStateAction<Form>>
  setAmount: Dispatch<SetStateAction<string | null>>
  clearForm?: boolean
  hasOrigem?: boolean
  isEditable?: boolean
  hasCalculate?: boolean
}

export default function FormLayout({
  form,
  amount,
  setForm,
  methods,
  children,
  clearForm,
  setAmount,
  hasOrigem,
  isEditable,
  hasCalculate,
}: FormProps) {
  const [loading, setLoading] = useState<"CALCULATE" | "SUBMIT" | null>(null)

  function onFile(type: "logo" | "gallery", imageList: ImageListType) {
    setForm((prev) => ({ ...prev, [type]: imageList }))
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

  function formatter(data: FormSchemaType) {
    const { address, ...rest } = data

    const fields = {
      ...rest,
      ...address,
      endAt: parseDMY(rest.endAt),
      hasLogo: form.logo.length === 1,
      startAt: parseDMY(rest.startAt),
      bodyType: fontType[form.body as keyof typeof fontType],
      logoType: logoType[form.logoType as keyof typeof logoType],
      titleType: fontType[form.title as keyof typeof fontType],
      subscriber: form.subscriber === "Sim",
      calculationType: hasOrigem
        ? origemType[rest.calculationType as keyof typeof origemType]
        : undefined,
      numberOfColumns:
        numberOfColumns[form.numberOfColumns as keyof typeof numberOfColumns],
      numberOfLinesBody: numberOfLines.body,
      numberOfLinesTitle: numberOfLines.title,
      numberOfPhotosInTheGallery: form.gallery.length,
    }

    return fields
  }

  async function calculate() {
    setLoading("CALCULATE")

    const data = methods.getValues()

    const fields = formatter(data)

    api
      .post("/classify/calculate", fields)
      .then(async ({ data }) => setAmount(data.amount.toString()))
      .catch(() =>
        toast.error("Desculpe, não conseguimos calcular o valor do anúncio.")
      )
      .finally(() => setLoading(null))
  }

  async function onSubmit(data: FormSchemaType) {
    setLoading("SUBMIT")

    const fields = formatter(data)

    api
      .post("/classify/form", fields)
      .then(async ({ data }) => {
        if (form.logo.length > 0 || form.gallery.length > 0) {
          const logo = form.logo.length > 0 ? form.logo[0].file : undefined

          const gallery =
            form.gallery.length > 0
              ? form.gallery.map(({ file }) => file as File)
              : undefined

          const fields = new FormData()

          fields.append("post_id", data.id)

          if (logo) fields.append("logo", logo, `logo-${data.id}.png`)

          if (gallery)
            gallery.forEach((file) => fields.append("gallery[]", file))

          await api
            .post("/classify/upload", fields, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .catch(({ response }) => toast.error(response.message))
        }

        if (clearForm) {
          setForm(initialFields)
          setAmount(null)

          methods.reset()
        }

        toast.success("Anúncio enviado com sucesso.")
      })
      .catch(() => toast.error("Desculpe, não conseguimos enviar o anúncio."))
      .finally(() => setLoading(null))
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Select
          name="calculationType"
          label="Origem"
          options={["Balcão", "Telefone"]}
          className={!hasOrigem ? "hidden" : ""}
          placeholder="Selecione a origem"
        />

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

        {children}

        <div className="flex mt-10 items-center justify-between gap-4">
          {amount && (
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-gray-400">Valor:</p>
              <p className="text-sm font-medium text-gray-600">
                {masks.money(amount)}
              </p>
            </div>
          )}

          <div className="flex ml-auto items-center gap-4">
            {hasCalculate && (
              <Button
                type="button"
                onClick={calculate}
                variant="secondary"
                disabled={loading === "CALCULATE"}
              >
                {loading === "CALCULATE" ? "Calculando ..." : "Calcular"}
              </Button>
            )}

            <Button type="submit" disabled={loading === "SUBMIT"}>
              {loading === "SUBMIT"
                ? "Enviando ..."
                : isEditable
                ? "Editar informações"
                : "Enviar informações"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

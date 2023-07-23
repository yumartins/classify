import "@/styles/main.scss"

import { useEffect, useState } from "react"
import { Input } from "@/components"
import { FormLayout, formSchema } from "@/layouts"
import { masks, reverseObject } from "@/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import type { ImageType } from "react-images-uploading"
import { z } from "zod"

import * as data from "../data"

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

type FormFile = {
  name: string
  path: string
}

type Files = {
  logo: FormFile | null
  gallery: FormFile[]
}

export default function App() {
  const [form, setForm] = useState(initialFields)
  const [files, setFiles] = useState<Files | null>(null)
  const [amount, setAmount] = useState<string | null>(null)

  const params = new URLSearchParams(window.location.search)

  const methods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const action = params.get("action")

  useEffect(() => {
    if (action === "edit") {
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
          street,
          number,
          bodyType,
          logoType,
          titleType,
          subscriber,
          neighborhood,
          numberOfColumns,
          ...rest
        } = parse

        const address = {
          city,
          state,
          street,
          number,
          neighborhood,
        }

        setForm((prev) => ({
          ...prev,
          logoType: reverseObject(data.logoType)[logoType],
          bodyType: reverseObject(data.fontType)[bodyType],
          titleType: reverseObject(data.fontType)[titleType],
          subscriber: subscriber === "1" ? "Sim" : "Não",
          numberOfColumns: reverseObject(data.numberOfColumns)[numberOfColumns],
        }))

        methods.setValue("address", address)

        Object.entries(rest).forEach(([key, value]) => {
          const formatter = () => {
            if (["total", "totalWithDiscount"].includes(key))
              return masks.money(value)

            if (["endAt", "startAt"].includes(key))
              return format(new Date(value), "dd/MM/yyyy")

            return value
          }

          methods.setValue(key as keyof FormSchemaType, formatter())
        })
      }
    }
  }, [action, methods])

  const total = methods.watch("total")
  const discount = methods.watch("discount")

  useEffect(() => {
    if (discount) {
      const values = {
        total: masks.clear(total || "") as number,
        discount: masks.clear(discount) as number,
      }

      const discountValue = (values.total / 100) * values.discount

      methods.setValue(
        "totalWithDiscount",
        masks.money((values.total - discountValue).toString())
      )
    }
  }, [total, methods, discount])

  return (
    <div className="classify mt-4 flex flex-col gap-4">
      <FormLayout
        form={form}
        amount={amount}
        methods={methods}
        setForm={setForm}
        setAmount={setAmount}
        hasOrigem={!action}
        isEditable={action === "edit"}
      >
        <div className="flex items-center gap-4">
          <Input
            name="total"
            mask="CURRENCY"
            label="Total"
            placeholder="Digite o valor total"
          />

          <Input
            name="discount"
            type="number"
            label="Desconto"
            placeholder="Digite o desconto (Porcentagem)"
          />

          <Input
            name="totalWithDiscount"
            mask="CURRENCY"
            label="Valor com desconto"
            disabled
            defaultValue="0"
          />
        </div>
      </FormLayout>

      {files && (files.logo || files.gallery.length > 0) && (
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

          {files && files.gallery.length > 0 && (
            <div className="col-span-2 flex flex-col gap-0.5">
              <p className="text-xs font-medium text-gray-400">
                Fotos (Digital)
              </p>

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
      )}

      <Toaster position="bottom-right" />
    </div>
  )
}

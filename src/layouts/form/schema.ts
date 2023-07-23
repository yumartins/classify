import { z } from "zod"

const address = z.object({
  city: z.string().optional(),
  state: z.string().toUpperCase().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
})

export default z.object({
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
  address,
  startAt: z.string().nonempty("Digite a data de início do anúncio"),
  category: z.string().nonempty("Selecione a categoria do anúncio"),
})

const general = [
  {
    name: "logo2cm",
    label: "Logo de 2cm",
    placeholder: "Digite o valor para logo de 2cm",
  },
  {
    name: "logo4cm",
    label: "Logo de 4cm",
    placeholder: "Digite o valor para logo de 4cm",
  },
  {
    name: "valuePerDay",
    label: "Valor por dia",
    placeholder: "Digite o valor por dia",
  },

  {
    name: "valuePerImage",
    label: "Valor por imagem (Digital)",
    placeholder: "Digite o valor por imagem",
  },
]

const printed = [
  ...general,
  {
    name: "valuePerLine",
    label: "Valor por linha",
    placeholder: "Digite o valor por linha",
  },
  {
    name: "bold",
    label: "Letra negrito",
    placeholder: "Digite o valor para letra em negrito",
  },
  {
    name: "regular",
    label: "Letra regular",
    placeholder: "Digite o valor para letra regular",
  },
  {
    name: "cursive",
    label: "Letra chamativa",
    placeholder: "Digite o valor para letra chamativa",
  },
]

const prayer = [
  ...general,
  {
    name: "churchInvitation",
    label: "Valor do convite de missa",
    placeholder: "Digite o valor do convite de missa",
  },
  {
    name: "publicityNotice",
    label: "Valor do informe publicitário",
    placeholder: "Digite o valor do informe publicitário",
  },
  {
    name: "sectionSponsorship",
    label: "Valor do patrocínio de seção",
    placeholder: "Digite o valor do patrocínio de seção",
  },
]

export const fields = {
  phone: printed,
  prayer,
  balcony: printed,
}

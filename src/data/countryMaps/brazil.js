/**
 * Brazil: 26 states + the Federal District, keyed by ISO 3166-2 code (= `id` in public/data/maps/br.json).
 * `seat` = state capital.
 */
export const BRAZIL = {
  id: 'br',
  file: 'br.json',
  country: "Brazil",
  divisions: [
    { id: 'BR-AC', name: "Acre", seat: "Rio Branco" },
    { id: 'BR-AL', name: "Alagoas", seat: "Maceió" },
    { id: 'BR-AP', name: "Amapá", seat: "Macapá" },
    { id: 'BR-AM', name: "Amazonas", seat: "Manaus" },
    { id: 'BR-BA', name: "Bahia", seat: "Salvador" },
    { id: 'BR-CE', name: "Ceará", seat: "Fortaleza" },
    { id: 'BR-ES', name: "Espírito Santo", seat: "Vitória" },
    { id: 'BR-GO', name: "Goiás", seat: "Goiânia" },
    { id: 'BR-MA', name: "Maranhão", seat: "São Luís" },
    { id: 'BR-MT', name: "Mato Grosso", seat: "Cuiabá" },
    { id: 'BR-MS', name: "Mato Grosso do Sul", seat: "Campo Grande" },
    { id: 'BR-MG', name: "Minas Gerais", seat: "Belo Horizonte" },
    { id: 'BR-PA', name: "Pará", seat: "Belém" },
    { id: 'BR-PB', name: "Paraíba", seat: "João Pessoa" },
    { id: 'BR-PR', name: "Paraná", seat: "Curitiba" },
    { id: 'BR-PE', name: "Pernambuco", seat: "Recife" },
    { id: 'BR-PI', name: "Piauí", seat: "Teresina" },
    { id: 'BR-RJ', name: "Rio de Janeiro", seat: "Rio de Janeiro" },
    { id: 'BR-RN', name: "Rio Grande do Norte", seat: "Natal" },
    { id: 'BR-RS', name: "Rio Grande do Sul", seat: "Porto Alegre" },
    { id: 'BR-RO', name: "Rondônia", seat: "Porto Velho" },
    { id: 'BR-RR', name: "Roraima", seat: "Boa Vista" },
    { id: 'BR-SC', name: "Santa Catarina", seat: "Florianópolis" },
    { id: 'BR-SP', name: "São Paulo", seat: "São Paulo" },
    { id: 'BR-SE', name: "Sergipe", seat: "Aracaju" },
    { id: 'BR-TO', name: "Tocantins", seat: "Palmas" },
    { id: 'BR-DF', name: "Federal District", ro: "Districtul Federal", alt: ["Distrito Federal", "DF"], seat: "Brasília", city: true },
  ],
}

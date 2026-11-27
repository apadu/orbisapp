/**
 * Ecuador: the 24 provinces, keyed by ISO 3166-2 code (= `id` in public/data/maps/ec.json).
 * The Galápagos sit in an inset. Seats = provincial capitals.
 */
export const ECUADOR = {
  id: 'ec',
  file: 'ec.json',
  country: "Ecuador",
  divisions: [
    { id: 'EC-A', name: "Azuay", seat: "Cuenca" },
    { id: 'EC-B', name: "Bolívar", alt: ["Bolivar"], seat: "Guaranda" },
    { id: 'EC-F', name: "Cañar", alt: ["Canar"], seat: "Azogues" },
    { id: 'EC-C', name: "Carchi", seat: "Tulcán", seatAlt: ["Tulcan"] },
    { id: 'EC-H', name: "Chimborazo", seat: "Riobamba" },
    { id: 'EC-X', name: "Cotopaxi", seat: "Latacunga" },
    { id: 'EC-O', name: "El Oro", seat: "Machala" },
    { id: 'EC-E', name: "Esmeraldas", seat: "Esmeraldas" },
    { id: 'EC-W', name: "Galápagos", alt: ["Galapagos", "Galápagos Islands", "Insulele Galápagos"], seat: "Puerto Baquerizo Moreno", seatAlt: ["Baquerizo Moreno", "Puerto Baquerizo"] },
    { id: 'EC-G', name: "Guayas", seat: "Guayaquil" },
    { id: 'EC-I', name: "Imbabura", seat: "Ibarra" },
    { id: 'EC-L', name: "Loja", seat: "Loja" },
    { id: 'EC-R', name: "Los Ríos", alt: ["Los Rios"], seat: "Babahoyo" },
    { id: 'EC-M', name: "Manabí", alt: ["Manabi"], seat: "Portoviejo" },
    { id: 'EC-S', name: "Morona Santiago", alt: ["Morona-Santiago"], seat: "Macas" },
    { id: 'EC-N', name: "Napo", seat: "Tena" },
    { id: 'EC-D', name: "Orellana", seat: "Puerto Francisco de Orellana", seatAlt: ["Francisco de Orellana", "Coca", "El Coca", "Puerto Orellana"] },
    { id: 'EC-Y', name: "Pastaza", seat: "Puyo" },
    { id: 'EC-P', name: "Pichincha", seat: "Quito" },
    { id: 'EC-SE', name: "Santa Elena", seat: "Santa Elena" },
    { id: 'EC-SD', name: "Santo Domingo de los Tsáchilas", alt: ["Santo Domingo", "Santo Domingo de los Tsachilas"], seat: "Santo Domingo", seatAlt: ["Santo Domingo de los Colorados"] },
    { id: 'EC-U', name: "Sucumbíos", alt: ["Sucumbios"], seat: "Nueva Loja", seatAlt: ["Lago Agrio"] },
    { id: 'EC-T', name: "Tungurahua", seat: "Ambato" },
    { id: 'EC-Z', name: "Zamora Chinchipe", alt: ["Zamora-Chinchipe"], seat: "Zamora" },
  ],
}

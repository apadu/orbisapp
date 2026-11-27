/**
 * Chile: the 16 regions (Ñuble since 2018), keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/cl.json; Aysén and Magallanes drawn as an inset). Seats = regional capitals.
 */
export const CHILE = {
  id: 'cl',
  file: 'cl.json',
  country: "Chile",
  divisions: [
    { id: 'CL-AP', name: "Arica y Parinacota", alt: ["Arica and Parinacota", "Arica"], seat: "Arica" },
    { id: 'CL-TA', name: "Tarapacá", alt: ["Tarapaca"], seat: "Iquique" },
    { id: 'CL-AN', name: "Antofagasta", seat: "Antofagasta" },
    { id: 'CL-AT', name: "Atacama", seat: "Copiapó", seatAlt: ["Copiapo"] },
    { id: 'CL-CO', name: "Coquimbo", seat: "La Serena" },
    { id: 'CL-VS', name: "Valparaíso", alt: ["Valparaiso"], seat: "Valparaíso", seatAlt: ["Valparaiso"] },
    { id: 'CL-RM', name: "Santiago Metropolitan", ro: "Regiunea Metropolitană Santiago", alt: ["Santiago", "Metropolitana", "Región Metropolitana", "Region Metropolitana", "Santiago Metropolitan Region", "RM"], seat: "Santiago" },
    { id: 'CL-LI', name: "O'Higgins", alt: ["Libertador General Bernardo O'Higgins", "OHiggins", "O Higgins", "Libertador"], seat: "Rancagua" },
    { id: 'CL-ML', name: "Maule", seat: "Talca" },
    { id: 'CL-NB', name: "Ñuble", alt: ["Nuble"], seat: "Chillán", seatAlt: ["Chillan"] },
    { id: 'CL-BI', name: "Biobío", alt: ["Bío Bío", "Bio Bio", "Bio-Bio", "Biobio"], seat: "Concepción", seatAlt: ["Concepcion"] },
    { id: 'CL-AR', name: "Araucanía", alt: ["La Araucanía", "Araucania", "La Araucania"], seat: "Temuco" },
    { id: 'CL-LR', name: "Los Ríos", alt: ["Los Rios"], seat: "Valdivia" },
    { id: 'CL-LL', name: "Los Lagos", seat: "Puerto Montt" },
    { id: 'CL-AI', name: "Aysén", alt: ["Aysen", "Aisén", "Aisen", "Aysén del General Carlos Ibáñez del Campo"], seat: "Coyhaique", seatAlt: ["Coihaique"] },
    { id: 'CL-MA', name: "Magallanes", alt: ["Magallanes y Antártica Chilena", "Magallanes and Chilean Antarctica", "Magallanes y la Antártica Chilena"], seat: "Punta Arenas" },
  ],
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  alt?: string
  video?: {
    src: string
    poster?: string
  }
}

export const projects: Project[] = [
  {
    id: "codesotec",
    title: "Codesotec",
    description:
      "Plataforma corporativa que muestra soluciones tecnológicas con un diseño moderno, optimizado para conversión y experiencia de usuario.",
    image: "/images/projects/codesotec.webp",
    alt: "Codesotec",
  },
  {
    id: "ong-gotas-de-esperanza",
    title: "ONG - Gotas de Esperanza",
    description:
      "Sitio web institucional para ONG con enfoque en transparencia, donaciones y difusión del impacto social.",
    image: "/images/projects/ong-gotas-de-esperanza.webp",
    alt: "ONG - Gotas de Esperanza",
  },
]

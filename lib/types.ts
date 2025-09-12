// Type definitions for LEGNO Pergola Configurator

export interface PergolaType {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

export interface CoverageType {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

export interface FlooringType {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

export interface Accessory {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  created_at: string
}

export interface ContactData {
  nome: string
  cognome: string
  email: string
  telefono: string
  citta: string
  indirizzo: string
  note?: string
  privacy_consent?: boolean
}

export interface Configuration {
  id?: string
  type_name?: string
  width: number
  depth: number
  height: number
  color_category?: string
  color_name?: string
  coverage_name?: string
  flooring_names: string[]
  accessory_names: string[]
  service_type?: "chiavi_in_mano" | "fai_da_te"
  contact_preference?: "email" | "telefono" | "whatsapp"
  contact_data?: ContactData
  total_price?: number
  created_at?: string
}

export interface HomepageSettings {
  id: string
  hero_title: string
  hero_subtitle: string
  hero_image_url: string
  dimensions_addossata_image: string
  dimensions_libera_image: string
  updated_at: string
}

export const colorPalettes = {
  smalto: [
    { name: "Bianco", value: "#FFFFFF" },
    { name: "Nero", value: "#000000" },
    { name: "Grigio Antracite", value: "#2F2F2F" },
    { name: "Rosso Mattone", value: "#8B4513" },
    { name: "Verde Bosco", value: "#228B22" },
  ],
  impregnante_legno: [
    { name: "Naturale", value: "#D2B48C" },
    { name: "Noce", value: "#8B4513" },
    { name: "Teak", value: "#CD853F" },
    { name: "Mogano", value: "#C04000" },
    { name: "Rovere", value: "#DEB887" },
  ],
  impregnante_pastello: [
    { name: "Verde Salvia", value: "#9CAF88" },
    { name: "Azzurro Cielo", value: "#87CEEB" },
    { name: "Rosa Antico", value: "#FADADD" },
    { name: "Beige Sabbia", value: "#F5F5DC" },
    { name: "Grigio Perla", value: "#E6E6FA" },
  ],
} as const

export type ColorCategory = keyof typeof colorPalettes

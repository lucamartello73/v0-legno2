import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Configuration, ContactData } from "./types"

interface ConfigurationStore extends Configuration {
  // Actions
  setType: (id: string, name: string) => void
  setDimensions: (width: number, depth: number, height: number) => void
  setColor: (category: string, name: string, value?: string) => void
  setCoverage: (id: string, name: string) => void
  setFlooring: (ids: string[], names: string[]) => void
  setAccessories: (ids: string[], names: string[]) => void
  setTotalPrice: (price: number) => void
  setService: (type: "chiavi_in_mano" | "fai_da_te") => void
  setContactPreference: (preference: "email" | "telefono" | "whatsapp") => void
  setContactData: (data: ContactData) => void
  reset: () => void

  // Validation
  isStepValid: (step: number) => boolean
}

const initialState: Configuration = {
  width: 300,
  depth: 300,
  height: 250,
  flooring_names: [],
  accessory_names: [],
  total_price: 0,
}

export const useConfigurationStore = create<ConfigurationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setType: (id: string, name: string) => set({ type_name: name }),

      setDimensions: (width: number, depth: number, height: number) => set({ width, depth, height }),

      setColor: (category: string, name: string, value?: string) => set({ color_category: category, color_name: name }),

      setCoverage: (id: string, name: string) => set({ coverage_name: name }),

      setFlooring: (ids: string[], names: string[]) => set({ flooring_names: names }),

      setAccessories: (ids: string[], names: string[]) => set({ accessory_names: names }),

      setTotalPrice: (price: number) => set({ total_price: price }),

      setService: (type: "chiavi_in_mano" | "fai_da_te") => set({ service_type: type }),

      setContactPreference: (preference: "email" | "telefono" | "whatsapp") => set({ contact_preference: preference }),

      setContactData: (data: ContactData) => set({ contact_data: data }),

      reset: () => set(initialState),

      isStepValid: (step: number) => {
        const state = get()
        switch (step) {
          case 1:
            return !!state.type_name
          case 2:
            return state.width >= 100 && state.depth >= 100 && state.height >= 200
          case 3:
            return !!state.color_category && !!state.color_name
          case 4:
            return !!state.coverage_name
          case 5:
            return true // Optional step
          case 6:
            return true // Optional step
          case 7:
            return !!(
              state.contact_data?.nome &&
              state.contact_data?.cognome &&
              state.contact_data?.email &&
              state.contact_data?.telefono &&
              state.contact_data?.citta &&
              state.contact_data?.indirizzo &&
              state.service_type &&
              state.contact_preference
            )
          case 8:
            return true // Summary step
          default:
            return false
        }
      },
    }),
    {
      name: "legno-configuration",
    },
  ),
)

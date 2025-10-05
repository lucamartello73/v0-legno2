// API utility functions for LEGNO configurator

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new ApiError(response.status, error.error || "Request failed")
  }

  return response.json()
}

// Pergola Types API
export const pergolaTypesApi = {
  getAll: () => apiRequest("/api/pergola-types"),
  create: (data: any) =>
    apiRequest("/api/pergola-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data: any) =>
    apiRequest("/api/pergola-types", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/pergola-types?id=${id}`, {
      method: "DELETE",
    }),
}

// Coverage Types API
export const coverageTypesApi = {
  getAll: () => apiRequest("/api/coverage-types"),
  create: (data: any) =>
    apiRequest("/api/coverage-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data: any) =>
    apiRequest("/api/coverage-types", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/coverage-types?id=${id}`, {
      method: "DELETE",
    }),
}

// Flooring Types API
export const flooringTypesApi = {
  getAll: () => apiRequest("/api/flooring-types"),
  create: (data: any) =>
    apiRequest("/api/flooring-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data: any) =>
    apiRequest("/api/flooring-types", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/flooring-types?id=${id}`, {
      method: "DELETE",
    }),
}

// Accessories API
export const accessoriesApi = {
  getAll: () => apiRequest("/api/accessories"),
  create: (data: any) =>
    apiRequest("/api/accessories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data: any) =>
    apiRequest("/api/accessories", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/accessories?id=${id}`, {
      method: "DELETE",
    }),
}

// Configurations API
export const configurationsApi = {
  getAll: () => apiRequest("/api/configurations"),
  create: (data: any) =>
    apiRequest("/api/configurations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/api/configurations?id=${id}`, {
      method: "DELETE",
    }),
}

// Homepage Settings API
export const homepageSettingsApi = {
  get: () => apiRequest("/api/homepage-settings"),
  update: (data: any) =>
    apiRequest("/api/homepage-settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// Email API
export const emailApi = {
  sendQuote: (data: any) =>
    apiRequest("/api/send-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  sendTest: (data: any) =>
    apiRequest("/api/test-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Image Upload API
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }))
      throw new ApiError(response.status, error.error || "Upload failed")
    }

    return response.json()
  },
}

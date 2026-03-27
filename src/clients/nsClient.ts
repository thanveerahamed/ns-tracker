import ky from 'ky'

const BASE_URL = import.meta.env.VITE_NS_OCP_API_ENDPOINT as string
const API_KEY = import.meta.env.VITE_NS_OCP_APIM_KEY as string

const nsApi = ky.create({
  prefixUrl: BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`,
  headers: {
    'Ocp-Apim-Subscription-Key': API_KEY,
    Accept: 'application/json',
  },
  retry: 1,
  timeout: 15_000,
})

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  const searchParams: Record<string, string> = { lang: 'en' }
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams[key] = String(value)
      }
    }
  }

  return nsApi.get(cleanPath, { searchParams }).json<T>()
}

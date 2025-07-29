type IResponse<T> = {
  message?: string
} & T

export function http(baseURL: string) {
  const request = async (
    path: string,
    options: RequestInit = {},
  ) => {
    const url = new URL(path, baseURL).toString()

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include'
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`HTTP ${res.status} - ${error}`)
    }

    return res.json()
  }

  return {
    get: <T = any>(path: string): Promise<IResponse<T>> => request(path),
    post: <T = any>(path: string, data?: any): Promise<IResponse<T>> =>
      request(path, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: <T = any>(path: string, data?: any): Promise<IResponse<T>> =>
      request(path, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: (path: string) =>
      request(path, {
        method: 'DELETE',
      }),
  }
}

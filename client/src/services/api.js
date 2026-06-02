const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      data.errors?.[0]?.msg || data.error || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.errors = data.errors
    throw err
  }
  return data
}

export const api = {
  expenses: {
    list: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString()
      return request(`/expenses${qs ? '?' + qs : ''}`)
    },
    get: (id) => request(`/expenses/${id}`),
    create: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  },
  summary: {
    monthly: (month) => request(`/summary/monthly?month=${month}`),
  },
}

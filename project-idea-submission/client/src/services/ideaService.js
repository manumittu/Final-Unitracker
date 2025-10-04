import api from './api'

export const createIdea = async (payload) => {
  const formData = new FormData()
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (k === 'attachment' && v instanceof File) {
      formData.append('attachment', v)
    } else if (Array.isArray(v)) {
      v.forEach(val => formData.append(`${k}[]`, val))
    } else {
      formData.append(k, v)
    }
  })
  const { data } = await api.post('/ideas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const getIdeas = async (params = {}) => {
  const { data } = await api.get('/ideas', { params })
  return data
}

export const updateIdea = async (id, payload) => {
  const { data } = await api.put(`/ideas/${id}`, payload)
  return data
}

export const deleteIdea = async (id) => {
  const { data } = await api.delete(`/ideas/${id}`)
  return data
}

export const stats = async () => {
  const { data } = await api.get('/ideas/stats')
  return data
}

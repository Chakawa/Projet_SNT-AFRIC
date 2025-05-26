// src/api.js

const API_BASE = 'http://localhost:5000/api'

// lit le token stocké
function getToken() {
  return localStorage.getItem('token')
}

// wrapper pour faire un fetch et gérer l’Authorization
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
  const resp = await fetch(url, { headers, ...options })
  const data = await resp.json()
  if (!resp.ok) throw new Error(data.message || 'Erreur API')
  return data
}

// crée une nouvelle demande
export async function createDemand(payload) {
  // payload = { serviceId, typeDemande, adresse, … }
  return request('/demandes', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// récupère les demandes du user
export async function getDemands() {
  return request('/demandes', { method: 'GET' })
}

// crée un commentaire sur une demande
export async function createComment(demandeId, contenu) {
  return request('/commentaires', {
    method: 'POST',
    body: JSON.stringify({ demandeId, contenu })
  })
}

// récupère les commentaires d’une demande
export async function getComments(demandeId) {
  return request(`/commentaires/${demandeId}`, { method: 'GET' })
}

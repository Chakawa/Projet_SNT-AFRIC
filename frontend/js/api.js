// src/api.js

// Base URL selon environnement (local ou production)
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://snt-backend-9hhe.onrender.com/api'

// Lit le token stocké
function getToken() {
  return localStorage.getItem('token')
}

// Wrapper pour faire un fetch avec gestion de l’Authorization
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

// Crée une nouvelle demande
export async function createDemand(payload) {
  // payload = { serviceId, typeDemande, adresse, … }
  return request('/demandes', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// Récupère les demandes du user
export async function getDemands() {
  return request('/demandes', { method: 'GET' })
}

// Crée un commentaire sur une demande
export async function createComment(demandeId, contenu) {
  return request('/commentaires', {
    method: 'POST',
    body: JSON.stringify({ demandeId, contenu })
  })
}

// Récupère les commentaires d’une demande
export async function getComments(demandeId) {
  return request(`/commentaires/${demandeId}`, { method: 'GET' })
}

// Base URL for the Flask backend API
const API_URL = 'http://127.0.0.1:5000/api'

// Helper function to get the JWT token from localStorage
const getToken = () => localStorage.getItem('access_token')

// Helper function to build headers - adds token if available
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` })
})

// AUTH
export const loginAdmin = (email: string, password: string) =>
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  }).then(res => res.json())

// STAFF
export const getStaff = () =>
  fetch(`${API_URL}/staff/`, { headers: getHeaders() }).then(res => res.json())

export const createStaff = (data: object) =>
  fetch(`${API_URL}/staff/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json())

export const updateStaff = (id: number, data: object) =>
  fetch(`${API_URL}/staff/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json())

export const deleteStaff = (id: number) =>
  fetch(`${API_URL}/staff/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(res => res.json())

// NEWS
export const getNews = () =>
  fetch(`${API_URL}/news/`, { headers: getHeaders() }).then(res => res.json())

export const createNews = (data: object) =>
  fetch(`${API_URL}/news/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json())

export const deleteNews = (id: number) =>
  fetch(`${API_URL}/news/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(res => res.json())

// EVENTS
export const getEvents = () =>
  fetch(`${API_URL}/events/`, { headers: getHeaders() }).then(res => res.json())

export const createEvent = (data: object) =>
  fetch(`${API_URL}/events/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json())

export const deleteEvent = (id: number) =>
  fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(res => res.json())

// GALLERY
export const getGallery = () =>
  fetch(`${API_URL}/gallery/`, { headers: getHeaders() }).then(res => res.json())

export const createGalleryImage = (data: object) =>
  fetch(`${API_URL}/gallery/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json())

export const deleteGalleryImage = (id: number) =>
  fetch(`${API_URL}/gallery/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(res => res.json())

// CONTACT
export const submitContact = (data: object) =>
  fetch(`${API_URL}/contact/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json())

// TESTIMONIALS
export const getTestimonials = () =>
  fetch(`${API_URL}/testimonials/`, { headers: getHeaders() }).then(res => res.json())

export const createTestimonial = (data: object) =>
  fetch(`${API_URL}/testimonials/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json())

export const deleteTestimonial = (id: number) =>
  fetch(`${API_URL}/testimonials/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(res => res.json())

export const getContactSubmissions = () =>
  fetch(`${API_URL}/contact/`, { headers: getHeaders() }).then(res => res.json())
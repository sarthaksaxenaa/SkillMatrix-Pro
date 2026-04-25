/**
 * Centralized API configuration.
 * All components import the base URL from here instead of hardcoding it.
 */

export const API_BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * POST JSON data to an API endpoint.
 */
export async function apiPost(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

/**
 * POST FormData (file uploads) to an API endpoint.
 */
export async function apiUpload(endpoint, formData) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || data.error || `Request failed with status ${response.status}`);
  }
  return data;
}

/**
 * GET data from an API endpoint.
 */
export async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: { ...getAuthHeaders() },
  });
  return response.json();
}

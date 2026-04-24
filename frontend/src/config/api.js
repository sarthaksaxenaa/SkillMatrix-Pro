/**
 * Centralized API configuration.
 * All components import the base URL from here instead of hardcoding it.
 */

export const API_BASE_URL = 'http://localhost:8000';

/**
 * POST JSON data to an API endpoint.
 */
export async function apiPost(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    body: formData,
  });
  return response.json();
}

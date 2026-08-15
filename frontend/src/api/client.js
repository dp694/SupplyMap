const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`);
  } catch (err) {
    throw new ApiError("Cannot reach the SupplyMap API. Is the backend running?", 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.error || `Request failed (${response.status})`, response.status);
  }

  return response.json();
}

export const api = {
  getSuppliers: () => request("/suppliers"),
  getSupplier: (id) => request(`/suppliers/${id}`),
  getSupplierDependencies: (id) => request(`/suppliers/${id}/dependencies`),
  getSupplierAlternatives: (id) => request(`/suppliers/${id}/alternatives`),
  getMaterials: () => request("/materials"),
  getProduct: (id) => request(`/products/${id}`),
  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),
};

export { ApiError };

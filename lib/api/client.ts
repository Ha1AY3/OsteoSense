export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export class ApiError extends Error {
  public status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const text = await response.text();
      if (text) errorDetail = text;
    } catch {
      // Ignore text parse failure
    }
    throw new ApiError(errorDetail || `API GET error: ${response.statusText}`, response.status);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const text = await response.text();
      if (text) errorDetail = text;
    } catch {
      // Ignore text parse failure
    }
    throw new ApiError(errorDetail || `API POST error: ${response.statusText}`, response.status);
  }

  return response.json() as Promise<T>;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assessments/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

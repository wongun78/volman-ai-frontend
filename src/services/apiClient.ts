const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Special handling for 401 Groq errors
      if (response.status === 401) {
        const errorText = await response.text();
        throw new Error(
          `Groq AI unauthorized (401). Check GROQ_API_KEY on the backend.\n${errorText}`
        );
      }
      
      const errorText = await response.text();
      throw new Error(errorText || `Request failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

export function getApiBase(): string {
  return API_BASE;
}

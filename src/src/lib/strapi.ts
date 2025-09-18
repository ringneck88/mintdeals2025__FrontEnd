const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiItem {
  id: number;
  attributes: Record<string, any>;
  [key: string]: any;
}

class StrapiClient {
  private baseUrl: string;

  constructor(baseUrl: string = STRAPI_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getMany<T = StrapiItem[]>(
    endpoint: string,
    populate?: string | string[]
  ): Promise<T> {
    let url = endpoint;

    if (populate) {
      const populateParam = Array.isArray(populate)
        ? populate.join(',')
        : populate;
      url += `?populate=${encodeURIComponent(populateParam)}`;
    }

    const response = await this.fetchApi<T>(url);
    return response.data;
  }

  async getOne<T = StrapiItem>(
    endpoint: string,
    id: string | number,
    populate?: string | string[]
  ): Promise<T> {
    let url = `${endpoint}/${id}`;

    if (populate) {
      const populateParam = Array.isArray(populate)
        ? populate.join(',')
        : populate;
      url += `?populate=${encodeURIComponent(populateParam)}`;
    }

    const response = await this.fetchApi<T>(url);
    return response.data;
  }

  async create<T = StrapiItem>(
    endpoint: string,
    data: Record<string, any>
  ): Promise<T> {
    const response = await this.fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
    return response.data;
  }

  async update<T = StrapiItem>(
    endpoint: string,
    id: string | number,
    data: Record<string, any>
  ): Promise<T> {
    const response = await this.fetchApi<T>(`${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
    return response.data;
  }

  async delete(endpoint: string, id: string | number): Promise<void> {
    await this.fetchApi(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const strapi = new StrapiClient();
export default strapi;
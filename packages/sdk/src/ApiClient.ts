import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

interface ApiResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
  // ... any other properties you consider important
}

class ApiClient {
  private http: AxiosInstance

  constructor() {
    this.http = axios.create()
    // Add any interceptors if needed
  }

  setBaseURL(baseURL: string): void {
    this.http.defaults.baseURL = baseURL
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.http.get<T>(url, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.http.post<T>(url, data, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.http.put<T>(url, data, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.http.delete<T>(url, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  private transformResponse<T>(response: any): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
      // ... map any other properties you want from the AxiosResponse
    }
  }

  private handleError(error: unknown): void {
    // Handle your errors here.
    // For now, this just re-throws the error, but you can enhance this.
    throw error
  }
}

export default ApiClient

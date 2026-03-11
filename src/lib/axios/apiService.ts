import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ApiError } from './apiError'
import { ApiResponse } from '@/types/apiRelatedTypes'
import { API_CONFIG } from '../config/apiConfig'

const getTimeoutForRequest = (url: string, customTimeout?: number): number => {
  return customTimeout ?? API_CONFIG.TIMEOUT ?? 50_000
}

export const createApiService = (client: AxiosInstance) => {
  return {
    async _request<T, D = unknown>(
      method: 'get' | 'post' | 'put' | 'delete',
      url: string,
      data?: D,
      config: AxiosRequestConfig = {}
    ): Promise<T> {
      let lastError: any = null
      for (let attempt = 0; attempt < API_CONFIG.RETRY_ATTEMPT; attempt++) {
          try {
            const requestConfig = {
              ...config,
              timeout: getTimeoutForRequest(url, config.timeout),
            }
    
            let response: ApiResponse<T>
    
            switch (method) {
              case 'get':
                response = await client.get(url, requestConfig)
                break
              case 'post':
                response = await client.post(url, data, requestConfig)
                break
              case 'put':
                response = await client.put(url, data, requestConfig)
                break
              case 'delete':
                response = await client.delete(url, requestConfig)
                break
            }
    
            const result = response.data
    
            // if (!result.status) {
            //   throw new ApiError(result.status as number, result.message ?? 'Unknown error')
            // }
            if (result) {
              return result
            }

          } catch (error: any) {
            lastError = error
            if (error instanceof ApiError && error.status < 500 ) break
            
            const isNetworkError = !error.response
            const is5xxError = error.response?.status >= 500

            if (isNetworkError || is5xxError) {
              await new Promise(resolve=>setTimeout(resolve,API_CONFIG.RETRY_DELAY))
              continue
            }
            break

          }
      }
      if (lastError instanceof ApiError) throw lastError
      if (lastError?.response) {
        throw new ApiError(lastError.response.status, lastError.response.data?.message || 'Server error')
      }
      throw new ApiError(500,lastError.message || 'Unknown Error!')
    },

    get<T>(url: string, config: AxiosRequestConfig = {}) {
      return this._request<T>('get', url, undefined, config)
    },

    post<T, D = unknown>(url: string, data?: D, config: AxiosRequestConfig = {}) {
      return this._request<T, D>('post', url, data, config)
    },

    put<T, D = unknown>(url: string, data?: D, config: AxiosRequestConfig = {}) {
      return this._request<T, D>('put', url, data, config)
    },

    delete<T>(url: string, config: AxiosRequestConfig = {}) {
      return this._request<T>('delete', url, undefined, config)
    },

    handleError(error: unknown): { statusCode: number ; message: string } {
      if (error instanceof ApiError) {
        return {
          statusCode: error.status,
          message: error.message,
        }
      }
      return {
        statusCode: 500,
        message: 'Unexpected error occurred',
      }
    },
  }
}

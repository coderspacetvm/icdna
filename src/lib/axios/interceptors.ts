import Cookies from 'js-cookie'
import { nkey } from '@/lib/config/cookiesConfig'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []


export const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token as string)
  })
  failedQueue = []
}

export const addToFailedQueue = (promise: {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}) => {
  failedQueue.push(promise)
}

export const clearAuthCookies = () => {
  Cookies.remove(nkey.auth_token)
  Cookies.remove(nkey.refresh_token)
  Cookies.remove(nkey.refresh_token_expiry)
  Cookies.remove(nkey.email_login)
  Cookies.remove(nkey.userID)
}

export const setIsRefreshing = (value: boolean) => {
  isRefreshing = value
}

export const getIsRefreshing = () => isRefreshing

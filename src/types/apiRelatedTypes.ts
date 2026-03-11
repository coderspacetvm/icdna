export interface TokenErrorResponse {
  isSuccess: boolean;
  message: string;
  status: 'Valid' | 'AccessTokenExpired' | 'RefreshTokenExpired' | 'TokenInvalid';
}


export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  status?: number | string;
  data: T;
  accessToken?: string;
  refreshToken?: string;
  refreshTokenExpiryTime?: string;
}

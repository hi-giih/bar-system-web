export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  access_token: string
}

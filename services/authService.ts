import { HTTP_API_URL } from "@/constants/settings";
import { tokenService } from "./tokenService";

export const authService = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${HTTP_API_URL}/auth/login/access-token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro durante o login: ${errorText}`)
    }

    const data = await response.json()
    await tokenService.setToken(data.access_token)
  },

  register: async (username: string, password: string) => {
    const response = await fetch(`${HTTP_API_URL}/users/`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro durante o registro: ${error}`)
    }
  },

  logout: async () => {
    await tokenService.removeToken()
  },
}


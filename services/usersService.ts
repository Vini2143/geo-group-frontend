import { HTTP_API_URL } from "@/constants/settings";
import { tokenService } from "./tokenService";

export const usersService = {
  getMe: async () => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/users/`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro: ${errorText}`)
    }

    return await response.json()
  },

  updateMePassword: async (current_password: string, new_password: string) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/users/me/password/`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ current_password, new_password }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro: ${error}`)
    }
  },

  updateMeLocation: async (lat: number, long: number) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/users/me/location/`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ lat, long }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro: ${error}`)
    }
  }
}

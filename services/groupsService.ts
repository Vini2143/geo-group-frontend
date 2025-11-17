import { HTTP_API_URL } from "@/constants/settings";
import { tokenService } from "./tokenService";


export const groupsService = {
  getMe: async () => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro: ${error}`)
    }

    return await response.json()
  },

  get: async (group_id: number) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/${group_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro: ${error}`)
    }

    return await response.json()
  },

  create: async (name: string) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro durante a criação: ${error}`)
    }
  },

  delete: async (group_id: number) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/${group_id}`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro durante a criação: ${error}`)
    }
  },

  join: async (group_code: string) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/join/${group_code}`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro durante a criação: ${error}`)
    }
  },

  leave: async (group_id: number) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/leave/${group_id}`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro durante a criação: ${error}`)
    }
  },


}
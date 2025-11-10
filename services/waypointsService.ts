import { HTTP_API_URL } from "@/constants/settings";
import { tokenService } from "./tokenService";


export const waypointsService = {
  getAllFromGroup: async (group_id: number) => {
    const token = await tokenService.getToken()
    
    const response = await fetch(`${HTTP_API_URL}/groups/${group_id}/waypoints/`, {
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

  create: async (group_id: number, name: string, lat: number, long: number) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/${group_id}/waypoints/`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, lat, long }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro: ${error}`)
    }
  },

  delete: async (waypoint_id: number) => {
    const token = await tokenService.getToken()

    const response = await fetch(`${HTTP_API_URL}/groups/waypoints/${waypoint_id}`, {
      method: "DELETE",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro: ${error}`)
    }
  },
}
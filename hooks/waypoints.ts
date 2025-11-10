import { waypointsService } from "@/services/waypointsService";
import { useState } from "react";
import { Alert } from "react-native";


export function useCreateWaypoints() {
  const [loading, setLoading] = useState(false)

  async function handleCreateWaypoints(group_id: number, name: string, lat: number, long: number) {
    try {
      setLoading(true)
      await waypointsService.create(group_id, name, lat, long)

    } catch (err) {
      console.error("Erro ao criar marcador:", err)
      Alert.alert("Erro", "Não foi possível criar o marcador.")
    }
    
    setLoading(false)
  }

  return { loading, handleCreateWaypoints }
}


export function useDeleteWaypoints() {
  const [loading, setLoading] = useState(false)

  async function handleDeleteWaypoints(waypoint_id: number) {
    try {
      setLoading(true)
      await waypointsService.delete(waypoint_id)

    } catch (err) {
      console.error("Erro ao carregar grupos:", err)
      Alert.alert("Erro", "Não foi possível carregar os grupos.")
    }
    
    setLoading(false)
  }

  return { loading, handleDeleteWaypoints }
}
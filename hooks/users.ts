import { usersService } from "@/services/usersService";
import { useState } from "react";
import { Alert } from "react-native";


export function useUpdateMePassword() {
  const [loading, setLoading] = useState(false)

  async function handleUpdateMePassword(current_password: string, new_password: string) {
    try {
      setLoading(true)
      await usersService.updateMePassword(current_password, new_password)

    } catch (err) {
      console.error("Erro ao alterar senha:", err)
      Alert.alert("Erro", "Não foi possível alterar senha.")
    }
    
    setLoading(false)
  }

  return { loading, handleUpdateMePassword }
}


export function useUpdateMeLocation() {
  const [loading, setLoading] = useState(false)

  async function handleUpdateMeLocation(lat: number, long: number) {
    try {
      setLoading(true)
      await usersService.updateMeLocation(lat, long)

    } catch (err) {
      console.error("Erro ao atualizar localização:", err)
      Alert.alert("Erro", "Não foi possível atualizar a localização.")
    }
    
    setLoading(false)
  }

  return { loading, handleUpdateMeLocation }
}
import { storageService } from "@/services/storageService";
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


export function useGetMe() {
  const [user, setUser] = useState()

  async function handleGetMe() {
    try {
      const localUser = await storageService.getUser().catch(() => null)

      if (!localUser) {
        setUser(localUser)
        return
      }

      const data = await usersService.getMe()
      await storageService.setUser(data)
      setUser(data)

    } catch (err) {
      console.error("Erro ao recuperar usuário:", err)
      Alert.alert("Erro", "Não foi possível recuperar dados do usuário.")
    }
    
  }

  return { handleGetMe, user}
}
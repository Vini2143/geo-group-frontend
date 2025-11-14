import { authService } from "@/services/authService";
import { storageService } from "@/services/storageService";
import { tokenService } from "@/services/tokenService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useGetMe } from "./users";

export function useCheckAuth() {
  const router = useRouter()

  useEffect(() => {
    const handleCheckAuth = async () => {
      const isAuth = await tokenService.checkToken()

      if (isAuth) {
        router.push("/home")
      } else {
        router.push("/login")
      }
    }

  handleCheckAuth()
  }, [])
}


export function useLogin() {
  const [loading, setLoading] = useState(false)
  const { handleGetMe } = useGetMe()
  const router = useRouter()

  async function handleLogin(username: string, password: string) {
    if (!username || !password) {
      Alert.alert("Erro", "Preencha usuário e senha.")
      return
    }

    try {
      setLoading(true);
      await authService.login(username, password)

      Alert.alert("Sucesso", "Login realizado!")
      await handleGetMe()

      setLoading(false)
      router.push("/home")
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      Alert.alert("Erro", "Usuário ou senha inválidos.")
    }

    setLoading(false)
  }

  return { handleLogin, loading }
}


export function useLogout() {
  const router = useRouter()

  async function handleLogout() {
    await authService.logout()
    await storageService.removeUser()
    router.push("/")
  }

  return { handleLogout }
}

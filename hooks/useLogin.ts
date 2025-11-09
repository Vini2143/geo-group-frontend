import { login } from "@/services/login";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert, Platform } from "react-native";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(username: string, password: string) {
    if (!username || !password) {
      Alert.alert("Erro", "Preencha usuário e senha.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(username, password);

      if (Platform.OS === "web") {
        localStorage.setItem("token", data.access_token);
      } else {
        await SecureStore.setItemAsync("token", data.access_token);
      }

      Alert.alert("Sucesso", "Login realizado!");
      router.push("/home");
    } catch (error) {
      Alert.alert("Erro", "Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading };
}

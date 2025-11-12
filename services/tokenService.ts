import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const tokenService = {

  setToken: async (token: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem("token", token)
    } else {
      await SecureStore.setItemAsync("token", token)
    }
  },

  removeToken: async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("token")
    } else {
      await SecureStore.deleteItemAsync("token")
    }
  },

  getToken: async () => {
    const token = Platform.OS === "web" ? localStorage.getItem("token") : await SecureStore.getItemAsync("token")
    if (!token) {
      throw new Error("Token não encontrado")
    }

    return token
  },

  checkToken: async () => {
    const token = Platform.OS === "web" ? localStorage.getItem("token") : await SecureStore.getItemAsync("token")

    return !!token
  }

}

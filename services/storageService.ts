import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storageService = {

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
  },

  setUser: async (user: any) => {
    const userString = JSON.stringify(user);
    if (Platform.OS === "web") {
      localStorage.setItem("user", userString);
    } else {
      await SecureStore.setItemAsync("user", userString);
    }
  },

  getUser: async () => {
    const userString =
      Platform.OS === "web"
        ? localStorage.getItem("user")
        : await SecureStore.getItemAsync("user");

    if (!userString) throw new Error("Usuário não encontrado");
    return JSON.parse(userString);
  },

  removeUser: async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("user");
    } else {
      await SecureStore.deleteItemAsync("user");
    }
  },

}

import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useCheckAuth() {
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
  const checkAuth = async () => {
      const token = Platform.OS === "web" ? localStorage.getItem("token") : await SecureStore.getItemAsync("token")

      if (token) {
        setIsAuth(true)
      } else {
        setIsAuth(false)
      }
  };

  checkAuth();
  }, []);

  return isAuth
}

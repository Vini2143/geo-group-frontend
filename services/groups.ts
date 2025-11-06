import { HTTP_API_URL } from "@/constants/settings";
import * as SecureStore from "expo-secure-store";

export async function getMeGroups() {
  const token = await SecureStore.getItemAsync("token");

  if (!token) {
    throw new Error("Token não encontrado");
  }

  const response = await fetch(`${HTTP_API_URL}/groups/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro: ${error}`);
  }

  return await response.json();
}
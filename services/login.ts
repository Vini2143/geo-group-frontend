import { HTTP_API_URL } from "@/constants/settings";

export async function login(username: string, password: string) {
  const response = await fetch(`${HTTP_API_URL}/auth/login/access-token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Erro no login");
  }

  return await response.json();
}

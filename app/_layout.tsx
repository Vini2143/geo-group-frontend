import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{ title: "Meus Grupos" }}
      />
      <Stack.Screen
        name="map"
        options={{ title: "Mapa" }}
      />
    </Stack>
  )
}

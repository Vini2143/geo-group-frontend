import MapRender from "@/components/MapRender";
import React from "react";
import { SafeAreaView } from "react-native";

const pontos = [
  { id: 1, latitude: -3.71722, longitude: -38.5434, title: "Ponto A" },
  { id: 2, latitude: -3.7300, longitude: -38.5200, title: "Ponto B" },
  { id: 3, latitude: -3.7205, longitude: -38.5300, title: "Ponto C" },
]

export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapRender points={pontos} />
    </SafeAreaView>
  )
}

import MapRender from "@/components/MapRender";
import React from "react";
import { SafeAreaView } from "react-native";

export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapRender/>
    </SafeAreaView>
  )
}

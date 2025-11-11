import { usersService } from "@/services/usersService";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Point = {
  id: number
  latitude: number
  longitude: number
  title?: string
  description?: string
}

type MapProps = {
  points: Point[]
  markerImage?: any
}

export default function MapRender({ points = [], markerImage = null }: MapProps) {
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "O aplicativo precisa da sua localização para exibir o mapa corretamente."
          )
          setLoading(false)
          return
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        })

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })

        await usersService.updateMeLocation(location.coords.latitude, location.coords.longitude)

      } catch (error) {
        console.error("Erro ao obter localização:", error);
        Alert.alert("Erro", "Não foi possível obter sua localização.");
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading || !userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={userLocation}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation={false}
        loadingEnabled
      >
        {points.map((point) => (
          <Marker
            key={String(point.id)}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={point.title}
            description={point.description}
            image={markerImage || undefined}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

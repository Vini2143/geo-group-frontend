import { socketioService } from "@/services/socketioService";
import { usersService } from "@/services/usersService";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type UserLocation = {
  id: number
  username: string
  lat: number
  long: number
}

export default function MapRender() {
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null)
  const [otherUsers, setOtherUsers] = useState<UserLocation[]>([])
  const [loading, setLoading] = useState(true)

  const { id } = useLocalSearchParams()
  
  

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;

    (async () => {
      const user = await usersService.getMe()
      
      console.log(user)
      await socketioService.connect(Number(id))

      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permissão negada", "O app precisa da sua localização.")
          setLoading(false)
          return
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation(location.coords)
        

        subscriber = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 3 },
          async (location) => {
            setUserLocation(location.coords)

            if (!user) return

            socketioService.updateLocation({
              id: user.id,
              username: user.username,
              lat: location.coords.latitude,
              long: location.coords.longitude,
            })
    
          }
        )

        socketioService.onReceiveServerData((data: UserLocation[]) => {
          const others = data.filter((u) => u.id !== user?.id)

          setOtherUsers(others)
        })


        socketioService.onUserUpdate((data: UserLocation) => {
          if (data.id === user?.id) return

          setOtherUsers((prev) => {
            const exists = prev.find((u) => u.id === data.id)
            if (exists) {
              return prev.map((u) => (u.id === data.id ? data : u))
            }
          
            return [...prev, data]
          })
        })

        socketioService.onUserDisconnect((data: UserLocation) => {
          if (!data?.id || data.id === user?.id) return

          setOtherUsers((prev) => prev.filter((u) => u.id !== data.id))
        })


      } catch (error) {
        console.error("Erro ao obter localização:", error)
        Alert.alert("Erro", "Não foi possível obter sua localização.")
      } finally {
        setLoading(false)
      }
    })()

    return () => {
      subscriber?.remove()
      socketioService.disconnect()
    
    }
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
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
      {otherUsers.map((u) => (
        <Marker key={u.id} coordinate={{ latitude: u.lat!, longitude: u.long! }} anchor={{ x: 0.2, y: 0.7 }}>
          <View style={styles.markerLabel}>
            <Text style={styles.markerText}>{u.username}</Text>
          </View>
          <View style={styles.markerCircle} />
        </Marker>
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
  markerCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
    bottom: 0
  },
  markerLabel: {
    alignItems: 'center',
    marginBottom: 0,
  },
  markerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: 'white',
    paddingHorizontal: 0,
    borderRadius: 4,
    overflow: 'hidden',
  }
});

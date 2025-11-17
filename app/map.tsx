import MapRender, { UserLocation } from "@/components/MapRender";
import { groupsService } from "@/services/groupsService";
import { socketioService } from "@/services/socketioService";
import { usersService } from "@/services/usersService";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, Switch, Text, View } from "react-native";

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null)
  const [otherUsers, setOtherUsers] = useState<UserLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(true)
  const [groupName, setGroupName] = useState()

  const { id } = useLocalSearchParams()

  const handleSetSharing = async (value: boolean) => {
    setSharing(value)
    console.log("sharing:", value)
    if (!value) {
      socketioService.stopSharing()
    }
    
  }
  
  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;

    (async () => {
      const user = await usersService.getMe()
      const group = await groupsService.get(Number(id))
      setGroupName(group.name)
      
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

            if (!user || !sharing) return

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ borderBottomWidth: 1, borderColor: "#ddd" }}>
        <Text style={{ marginHorizontal: 8, fontSize: 15, fontWeight: "bold" }}>Grupo: {groupName}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginHorizontal: 8, fontSize: 15, fontWeight: "bold" }}>Compartilhar Localização</Text>
          <Switch value={sharing} onValueChange={handleSetSharing} />

        </View>

      </View>
      <MapRender
      loading={loading}
      userLocation={userLocation}
      otherUsers={otherUsers}
      />
    </SafeAreaView>
  )
}

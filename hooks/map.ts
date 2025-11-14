// useUserMap.ts
import { useGetMe } from "@/hooks/users";
import { socketioService } from "@/services/socketioService";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export type UserLocation = {
  id: number
  username: string
  lat: number
  long: number
};

export function useUserMap(groupId: number | string) {
  const { handleGetMe, user } = useGetMe()
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null)
  const [otherUsers, setOtherUsers] = useState<UserLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null

    const init = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          alert("Permissão negada. O app precisa da sua localização.")
          setLoading(false)
          return
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
        setUserLocation(location.coords)

        await handleGetMe()

        if (!user) return

        await socketioService.connect(Number(groupId));

        subscriber = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 3 },
          (loc) => {
            setUserLocation(loc.coords)

            socketioService.updateLocation({
              id: user.id,
              username: user.username,
              lat: loc.coords.latitude,
              long: loc.coords.longitude,
            })
          }
        )

        socketioService.onReceiveServerData((data: UserLocation[]) => {
          const others = data.filter((u) => u.id !== user?.id)
          setOtherUsers(others)
        });

        socketioService.onUserUpdate((data: UserLocation) => {
          if (data.id === user?.id) return
          setOtherUsers((prev) => {
            const exists = prev.find((u) => u.id === data.id)
            if (exists) return prev.map((u) => (u.id === data.id ? data : u))
            return [...prev, data]
          })
        })

        socketioService.onUserDisconnect((data: UserLocation) => {
          if (!data?.id || data.id === user?.id) return
          setOtherUsers((prev) => prev.filter((u) => u.id !== data.id))
        })
      } catch (error) {
        console.error("Erro ao inicializar mapa:", error)
        alert("Não foi possível obter sua localização.")
      } finally {
        setLoading(false)
      }
    };

    init()

    return () => {
      subscriber?.remove()
      socketioService.disconnect()
    };
  }, [groupId, user])

  return { userLocation, otherUsers, loading };
}

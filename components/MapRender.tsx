import * as Location from "expo-location";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export type UserLocation = {
  id: number
  username: string
  lat: number
  long: number
}

interface MapProps {
  loading: boolean
  userLocation: Location.LocationObjectCoords | null
  otherUsers: UserLocation[]

}

export default function MapRender({ loading, userLocation, otherUsers } : MapProps) {
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

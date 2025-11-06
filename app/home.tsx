import { getMeGroups } from "@/services/groups";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function HomeScreen() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getMeGroups();
        setGroups(data);
      } catch (err) {
        console.error("Erro ao carregar grupos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Meus Grupos</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

import { CreateGroupModal } from "@/components/modalCreateGroup";
import { JoinGroupModal } from "@/components/modalJoinGroup";
import { useLogout } from "@/hooks/auth";
import { useGetMeGroups, useLeaveGroups } from "@/hooks/groups";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";

export default function HomeScreen() {
  const { refreshMeGroups, groups, loading } = useGetMeGroups()
  const { handleLeaveGroups, loading: leaving } = useLeaveGroups()
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false)
  const { handleLogout } = useLogout()
  const router = useRouter()
  

  useEffect(() => {
    refreshMeGroups()
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginRight: "auto" }}>Meus Grupos</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Button title="Logout" color="red" onPress={ handleLogout } />
        <Button title="Criar grupo" onPress={() => setIsCreateModalVisible(true)} />
        <Button title="Entrar em grupo" onPress={() => setIsJoinModalVisible(true)} />
        
      </View>

      <CreateGroupModal
        visible={isCreateModalVisible}
        onClose={ async () => { 
          setIsCreateModalVisible(false)
          await refreshMeGroups()
        }}
      />

      <JoinGroupModal
        visible={isJoinModalVisible}
        onClose={ async () => { 
          setIsJoinModalVisible(false)
          await refreshMeGroups()
        }}
      />

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, justifyContent: "space-between", flexDirection: 'row' }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Button
              title={leaving ? "Saindo..." : "Sair"}
              color="red"
              disabled={leaving}
              onPress={async () => {
                await handleLeaveGroups(item.id)
                await refreshMeGroups()
              }}
            />
            <Button title="Ver mapa" onPress={() => router.push(`/map?id=${item.id}`) } />
          </View>
        )}
      />
      
    </View>
  );
}

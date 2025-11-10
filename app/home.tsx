import { CreateGroupModal } from "@/components/modalCreateGroup";
import { JoinGroupModal } from "@/components/modalJoinGroup";
import { useGetMeGroups, useLeaveGroups } from "@/hooks/groups";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";

export default function HomeScreen() {
  const { refreshMeGroups, groups, loading } = useGetMeGroups()
  const { handleLeaveGroups, loading: leaving } = useLeaveGroups()
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false)

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

      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginRight: "auto" }}>Meus Grupos</Text>
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
          </View>
        )}
      />
      
    </View>
  );
}

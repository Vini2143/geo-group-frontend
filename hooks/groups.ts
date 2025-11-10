import { groupsService } from "@/services/groupsService";
import { useState } from "react";
import { Alert } from "react-native";


export function useGetMeGroups() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const refreshMeGroups = async () => {
    try {
      setLoading(true)
      const data = await groupsService.getMe()

      setGroups(data)
    } catch (err) {
      console.error("Erro ao carregar grupos:", err)
      Alert.alert("Erro", "Não foi possível carregar os grupos.")
    }
    
    setLoading(false)
  }

  return { refreshMeGroups, groups, loading }
}


export function useCreateGroups() {
  const [loading, setLoading] = useState(false);

  async function handleCreateGroup(name: string) {
    if (!name) {
      Alert.alert("Erro", "Informe o nome do grupo.")
      return
    }

    try {
      setLoading(true)
      await groupsService.create(name)

      Alert.alert("Sucesso", "Grupo criado com sucesso!")
    } catch (err) {
      console.error("Erro ao criar grupo:", err)
      Alert.alert("Erro", "Não foi possível criar o grupo.")
    } 
    
    setLoading(false)
  }

  return { handleCreateGroup, loading }
}


export function useJoinGroups() {
  const [loading, setLoading] = useState(false);

  async function handleJoinGroup(group_code: string) {
    if (!group_code) {
      Alert.alert("Erro", "Informe o código de convite do grupo.")
      return
    }

    try {
      setLoading(true);
      await groupsService.join(group_code)

      Alert.alert("Sucesso", "Entrou no grupo com sucesso!")
    } catch (err) {
      console.error("Erro ao criar grupo:", err)
      Alert.alert("Erro", "Não foi possível entrar o grupo.")
    } 
    
    setLoading(false)
  }

  return { handleJoinGroup, loading }
}


export function useLeaveGroups() {
  const [loading, setLoading] = useState(false);

  async function handleLeaveGroups(group_id: number) {
    try {
      setLoading(true);
      await groupsService.leave(group_id)

      Alert.alert("Sucesso", "Saiu do grupo com sucesso!")
    } catch (err) {
      console.error("Erro ao criar grupo:", err)
      Alert.alert("Erro", "Não foi possível sair do grupo.")
    } 
    
    setLoading(false)
  }

  return { handleLeaveGroups, loading }
}

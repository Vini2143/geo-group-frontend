import { useCreateGroups } from "@/hooks/groups";
import React, { useState } from "react";
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ModalProps {
  visible: boolean
  onClose: () => void
}

export function CreateGroupModal({ visible, onClose }: ModalProps) {
  const [ name, setName] = useState("")
  const { handleCreateGroup, loading } = useCreateGroups()

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Criar um grupo</Text>
          <TextInput
            placeholder="Nome do grupo"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Button 
            title={loading ? "Criando..." : "Criar"} 
            onPress={async () => {
              await handleCreateGroup(name)
              setName("")
              onClose()
            }}
            disabled={loading} />
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
})

import { useSignup } from "@/hooks/auth";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";


export default function SignupScreen() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { handleSignup, loading } = useSignup()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>

      <TextInput
        placeholder="Usuário"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button title={loading ? "Cadastrando..." : "Cadastrar"} onPress={ () => handleSignup(username, password)} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

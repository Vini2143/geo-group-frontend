import { login } from "@/services/login";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, TextInput, View } from "react-native";


export default function LoginScreen() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Erro", "Preencha usuário e senha.")
      return;
    }

    try {
      setLoading(true)
      const data = await login(username, password)
      
      if (Platform.OS === "web") {
        localStorage.setItem("token", data.access_token)
      } else {
        await SecureStore.setItemAsync("token", data.access_token)
      }
      
      Alert.alert("Sucesso", "Login realizado!")
      router.push("/home")
    } catch (error) {
      Alert.alert("Erro", "Usuário ou senha inválidos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <Button title={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
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

import { useLogin } from "@/src/hooks/useLogin";
import { LoginRequest } from "@/src/types/auth.type";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useLogin();

  const onSubmit = async () => {
    console.log(`User login with: ${email}, ${password}`);
    const req: LoginRequest = { email, password };
    await login(req);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Email</Text>
      <TextInput autoCapitalize="none" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 10 }} />

      <Text>Password</Text>
      <TextInput secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 10 }} />

      <Button title="Login" onPress={onSubmit} />
      <Link href="/(public)/register">Go to Register</Link>
      <Link href="/(public)/forgot-password">Forgot password?</Link>
    </View>
  );
}

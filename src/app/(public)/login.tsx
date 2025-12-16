import { FirebaseError } from "@firebase/util";
import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth } from "../../lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log(user.email);
    } catch (e: any) {
      const err = e as FirebaseError;
      Alert.alert("Login failed", err.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Email</Text>
      <TextInput autoCapitalize="none" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 10 }} />

      <Text>Password</Text>
      <TextInput secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 10 }} />

      <Button title="Login" onPress={onLogin} />

      <Link href="/(public)/register">Go to Register</Link>
      <Link href="/(public)/forgot-password">Forgot password?</Link>
    </View>
  );
}

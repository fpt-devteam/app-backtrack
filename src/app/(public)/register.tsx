import { signup } from "@/src/services/auth.service";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function Register() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword
    );
  }, [email, password, confirmPassword]);

  const onSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Invalid", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await signup({ email, password });

    } catch (err: any) {
      Alert.alert("Sign up error", err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Create account</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <Button
        title={loading ? "Creating..." : "Sign up"}
        onPress={onSignup}
        disabled={!canSubmit || loading}
      />

      <Text style={{ marginTop: 8 }}>
        Already have an account?{" "}
        <Link href="/(public)/login" style={{ fontWeight: "700" }}>
          Login
        </Link>
      </Text>
    </View>
  );
}

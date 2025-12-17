import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogin } from "@/src/hooks/useLogin";
import { LoginRequest } from "@/src/types/auth.type";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, loading, error } = useLogin();

  const feedback = useMemo(() => localError ?? error, [localError, error]);

  const onSubmit = async () => {
    setLocalError(null);
    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password.");
      return;
    }

    const req: LoginRequest = { email: email.trim(), password };
    try {
      await login(req);
    } catch (err: any) {
      if (err?.message) setLocalError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.hero}>
              <View style={styles.logoWrap}>
                <Image source={require("@/assets/icons/logo.png")} style={styles.logo} />
              </View>
              <Text style={styles.title}>BackTrack</Text>
              <Text style={styles.subtitle}>Find what matters. Please login to continue.</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="user@example.com"
                  placeholderTextColor="#a0a9b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
                <Ionicons name="mail-outline" size={20} color="#70819a" />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="***********"
                  placeholderTextColor="#a0a9b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} hitSlop={12}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#70819a" />
                </TouchableOpacity>
              </View>

              <View style={styles.linkRow}>
                <Link href="/(public)/forgot-password" style={styles.linkText}>
                  Forgot Password?
                </Link>
              </View>

              {feedback ? <Text style={styles.errorText}>{feedback}</Text> : null}

              <TouchableOpacity style={styles.primaryButton} onPress={onSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Login</Text>
                    <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                  <MaterialIcons name="sms" size={18} color="#1f2d3d" />
                  <Text style={styles.socialText}>SMS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={18} color="#e5453b" />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Link href="/(public)/register" style={styles.signUpText}>
              Sign Up
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e8eaef",
  },
  content: {
    padding: 24,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 22,
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  hero: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoWrap: {
    height: 70,
    width: 70,
    borderRadius: 20,
    backgroundColor: "#e5f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 40,
    width: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2a44",
    marginTop: 12,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b768a",
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    color: "#1f2a44",
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d4dae2",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f7f9fc",
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1f2a44",
  },
  linkRow: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  linkText: {
    fontSize: 13,
    color: "#1e6ee8",
    fontWeight: "600",
  },
  errorText: {
    marginTop: 10,
    color: "#c53030",
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#1d7dec",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#1d7dec",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e5ed",
  },
  dividerText: {
    fontSize: 12,
    color: "#6b768a",
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e5ed",
    borderRadius: 10,
    height: 48,
    backgroundColor: "#ffffff",
  },
  socialText: {
    fontSize: 14,
    color: "#1f2a44",
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#4b5563",
  },
  signUpText: {
    fontSize: 13,
    color: "#1d7dec",
    fontWeight: "700",
  },
});

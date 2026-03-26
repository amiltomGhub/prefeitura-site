import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

const C = Colors.light;

function formatCPF(value: string): string {
  const n = value.replace(/\D/g, "").slice(0, 11);
  return n
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, municipio } = useApp();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogin = async () => {
    if (cpf.replace(/\D/g, "").length !== 11) {
      Alert.alert("CPF inválido", "Por favor, informe um CPF válido com 11 dígitos.");
      return;
    }
    if (senha.length < 4) {
      Alert.alert("Senha inválida", "A senha deve ter pelo menos 4 caracteres.");
      return;
    }
    setIsLoading(true);
    try {
      const ok = await login(cpf, senha);
      if (ok) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Erro", "CPF ou senha incorretos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: C.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[C.primaryDark, C.primary]}
          style={[styles.header, { paddingTop: topInset + 20 }]}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
          </Pressable>
          <View style={styles.municipioChip}>
            <Ionicons name="business" size={14} color={C.primaryLight} />
            <Text style={styles.municipioChipText}>{municipio?.nome ?? "Portal Municipal"} · {municipio?.uf ?? "BR"}</Text>
          </View>
          <Text style={styles.headerTitle}>Entrar na sua conta</Text>
          <Text style={styles.headerSub}>Acesse os serviços municipais</Text>
        </LinearGradient>

        <View style={[styles.form, { paddingBottom: bottomInset + 40 }]}>
          <View style={styles.field}>
            <Text style={styles.label}>CPF</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={18} color={C.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor={C.textMuted}
                value={cpf}
                onChangeText={(t) => setCpf(formatCPF(t))}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color={C.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor={C.textMuted}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showSenha}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable onPress={() => setShowSenha(!showSenha)}>
                <Ionicons name={showSenha ? "eye-off-outline" : "eye-outline"} size={18} color={C.textSecondary} />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.9 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.visitorBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.replace("/(tabs)")}
          >
            <Ionicons name="eye-outline" size={18} color={C.primary} />
            <Text style={styles.visitorText}>Continuar como visitante</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.cadastroLink, pressed && { opacity: 0.7 }]}
            onPress={() => router.push("/(public)/cadastro")}
          >
            <Text style={styles.cadastroText}>Não tem conta? <Text style={styles.cadastroLink2}>Cadastre-se</Text></Text>
          </Pressable>

          <Text style={styles.lgpdNote}>
            Ao entrar, você concorda com nossa Política de Privacidade e Termos de Uso, em conformidade com a LGPD (Lei 13.709/2018).
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 8,
  },
  backBtn: { marginBottom: 16, padding: 4, alignSelf: "flex-start" },
  municipioChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  municipioChipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.9)" },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  form: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  field: { gap: 6 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.text },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: C.text },
  forgotBtn: { alignSelf: "flex-end", marginTop: -4 },
  forgotText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.primary },
  loginBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  loginBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary },
  visitorBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: C.surfaceSecondary,
  },
  visitorText: { fontSize: 15, fontFamily: "Inter_500Medium", color: C.primary },
  cadastroLink: { alignItems: "center" },
  cadastroLink2: { color: C.primary, fontFamily: "Inter_600SemiBold" },
  cadastroText: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary },
  lgpdNote: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 4,
  },
});

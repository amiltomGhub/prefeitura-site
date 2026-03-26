import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

const C = Colors.light;

function formatCPF(v: string): string {
  const n = v.replace(/\D/g, "").slice(0, 11);
  return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export default function CadastroScreen() {
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [senha, setSenha] = useState("");
  const [lgpd, setLgpd] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleCadastro = () => {
    if (!nome || !cpf || !email || !senha) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos obrigatórios.");
      return;
    }
    if (!lgpd) {
      Alert.alert("LGPD", "Você precisa aceitar os termos para continuar.");
      return;
    }
    Alert.alert("Cadastro enviado!", "Verifique seu e-mail para confirmar o cadastro.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={{ flex: 1, backgroundColor: C.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: topInset + 8 }]}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
            <Ionicons name="arrow-back" size={24} color={C.text} />
          </Pressable>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para usar todos os serviços</Text>
        </View>

        <View style={[styles.form, { paddingBottom: bottomInset + 32 }]}>
          {[
            { label: "Nome completo *", val: nome, set: setNome, icon: "person-outline" as const, placeholder: "Seu nome completo", keyboard: "default" as const },
            { label: "CPF *", val: cpf, set: (t: string) => setCpf(formatCPF(t)), icon: "card-outline" as const, placeholder: "000.000.000-00", keyboard: "numeric" as const },
            { label: "E-mail *", val: email, set: setEmail, icon: "mail-outline" as const, placeholder: "seu@email.com", keyboard: "email-address" as const },
            { label: "Telefone", val: tel, set: setTel, icon: "call-outline" as const, placeholder: "(00) 00000-0000", keyboard: "phone-pad" as const },
          ].map((f) => (
            <View key={f.label} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name={f.icon} size={18} color={C.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder={f.placeholder}
                  placeholderTextColor={C.textMuted}
                  value={f.val}
                  onChangeText={f.set}
                  keyboardType={f.keyboard}
                  autoCapitalize={f.keyboard === "default" ? "words" : "none"}
                />
              </View>
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Senha *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color={C.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={C.textMuted}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>
          </View>

          <Pressable style={styles.lgpdRow} onPress={() => setLgpd(!lgpd)}>
            <View style={[styles.checkbox, lgpd && styles.checkboxChecked]}>
              {lgpd && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.lgpdText}>
              Aceito a <Text style={styles.lgpdLink}>Política de Privacidade</Text> e os <Text style={styles.lgpdLink}>Termos de Uso</Text> (LGPD)
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btn, !lgpd && styles.btnDisabled, pressed && { opacity: 0.9 }]}
            onPress={handleCadastro}
            disabled={!lgpd}
          >
            <Text style={styles.btnText}>Criar conta</Text>
          </Pressable>

          <Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
            <Text style={styles.loginText}>Já tem conta? <Text style={styles.loginLink}>Entrar</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 6,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", color: C.text, marginTop: 12 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary },
  form: { padding: 24, gap: 16 },
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
  lgpdRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: C.primary, borderColor: C.primary },
  lgpdText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 18 },
  lgpdLink: { color: C.primary, fontFamily: "Inter_500Medium" },
  btn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  loginText: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary, textAlign: "center" },
  loginLink: { color: C.primary, fontFamily: "Inter_600SemiBold" },
});

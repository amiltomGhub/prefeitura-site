import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { MUNICIPIOS, Municipio, useApp } from "@/contexts/AppContext";

const C = Colors.light;

interface ToggleItem {
  label: string;
  desc: string;
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  key: string;
}

const NOTIF_ITEMS: ToggleItem[] = [
  { label: "Manifestações", desc: "Atualização de status", icon: "megaphone-outline", key: "manifestacoes" },
  { label: "Notícias", desc: "Novas publicações", icon: "newspaper-outline", key: "noticias" },
  { label: "Agenda", desc: "Eventos próximos", icon: "calendar-outline", key: "agenda" },
  { label: "Tributos", desc: "Vencimentos de IPTU", icon: "receipt-outline", key: "tributos" },
  { label: "Alertas emergenciais", desc: "Sempre ativo", icon: "warning-outline", key: "emergencias" },
];

function SettingRow({ icon, label, value, onPress, chevron = true, color = C.text }: {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  color?: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingRow, pressed && onPress && { backgroundColor: C.borderLight }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color={color === C.text ? C.primary : color} />
      <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      <View style={{ flex: 1 }} />
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {chevron && onPress && <Ionicons name="chevron-forward" size={16} color={C.textMuted} />}
    </Pressable>
  );
}

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const { usuario, municipio, isAuthenticated, logout, selecionarMunicipio } = useApp();
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    manifestacoes: true,
    noticias: true,
    agenda: false,
    tributos: true,
    emergencias: true,
  });

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          logout();
          router.replace("/(public)");
        },
      },
    ]);
  };

  const handleTrocarMunicipio = () => {
    Alert.alert(
      "Trocar Município",
      "Selecione um município:",
      MUNICIPIOS.map((m) => ({
        text: `${m.nome} — ${m.uf}${municipio?.id === m.id ? " ✓" : ""}`,
        onPress: () => selecionarMunicipio(m),
      })).concat([{ text: "Cancelar", onPress: () => {} }])
    );
  };

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Cidadão";
  const iniciais = usuario?.nome
    ? usuario.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")
    : "C";

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomInset + 100 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Avatar / Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
          <View style={styles.profileInfo}>
            {isAuthenticated ? (
              <>
                <Text style={styles.profileName}>{usuario?.nome ?? "Usuário"}</Text>
                <Text style={styles.profileEmail}>{usuario?.email}</Text>
                <View style={styles.cpfBadge}>
                  <Ionicons name="shield-checkmark-outline" size={12} color={C.success} />
                  <Text style={styles.cpfBadgeText}>Conta verificada</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.profileName}>Modo Visitante</Text>
                <Text style={styles.profileEmail}>Faça login para acessar todos os recursos</Text>
                <Pressable
                  style={styles.loginChip}
                  onPress={() => router.push("/(public)/login")}
                >
                  <Text style={styles.loginChipText}>Entrar / Cadastrar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Município atual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Município</Text>
          <View style={styles.card}>
            <SettingRow
              icon="business"
              label={`${municipio?.nome ?? "Nenhum"} · ${municipio?.uf ?? ""}`}
              value="Trocar"
              onPress={handleTrocarMunicipio}
            />
          </View>
        </View>

        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.card}>
            {NOTIF_ITEMS.map((item, i) => (
              <View key={item.key}>
                <View style={styles.notifRow}>
                  <View style={[styles.notifIcon, { backgroundColor: C.surfaceSecondary }]}>
                    <Ionicons name={item.icon} size={16} color={C.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifLabel}>{item.label}</Text>
                    <Text style={styles.notifDesc}>{item.desc}</Text>
                  </View>
                  <Switch
                    value={item.key === "emergencias" ? true : notifs[item.key]}
                    disabled={item.key === "emergencias"}
                    onValueChange={(val) => {
                      Haptics.selectionAsync();
                      setNotifs((prev) => ({ ...prev, [item.key]: val }));
                    }}
                    trackColor={{ false: C.border, true: C.primary + "60" }}
                    thumbColor={notifs[item.key] ? C.primary : C.textMuted}
                    ios_backgroundColor={C.border}
                  />
                </View>
                {i < NOTIF_ITEMS.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Conta */}
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>
            <View style={styles.card}>
              <SettingRow icon="person-outline" label="Dados pessoais" onPress={() => {}} />
              <View style={styles.rowDivider} />
              <SettingRow icon="lock-closed-outline" label="Alterar senha" onPress={() => {}} />
              <View style={styles.rowDivider} />
              <SettingRow icon="megaphone-outline" label="Minhas manifestações" onPress={() => router.push("/ouvidoria" as never)} />
            </View>
          </View>
        )}

        {/* Sobre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <View style={styles.card}>
            <SettingRow icon="shield-outline" label="Política de Privacidade" onPress={() => {}} />
            <View style={styles.rowDivider} />
            <SettingRow icon="document-text-outline" label="Termos de Uso" onPress={() => {}} />
            <View style={styles.rowDivider} />
            <SettingRow icon="information-circle-outline" label="Versão do app" value="1.0.0" chevron={false} />
          </View>
        </View>

        {/* Logout / Login */}
        {isAuthenticated ? (
          <View style={[styles.section, { marginTop: 4 }]}>
            <View style={styles.card}>
              <SettingRow
                icon="log-out-outline"
                label="Sair da conta"
                onPress={handleLogout}
                color={C.error}
                chevron={false}
              />
            </View>
          </View>
        ) : (
          <View style={[styles.section, { marginTop: 4 }]}>
            <Pressable
              style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.9 }]}
              onPress={() => router.push("/(public)/login")}
            >
              <Ionicons name="log-in-outline" size={18} color="#fff" />
              <Text style={styles.loginBtnText}>Entrar / Criar conta</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  avatarBig: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 18, fontFamily: "Inter_700Bold", color: C.text },
  profileEmail: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary },
  cpfBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: C.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cpfBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: C.success },
  loginChip: {
    marginTop: 6,
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  loginChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  section: { paddingHorizontal: 16, marginTop: 20, gap: 8 },
  sectionTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, paddingHorizontal: 4 },
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  settingValue: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary },
  rowDivider: { height: 1, backgroundColor: C.borderLight, marginLeft: 48 },
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notifIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  notifLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text },
  notifDesc: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary },
  loginBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loginBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { MUNICIPIOS, Municipio, useApp } from "@/contexts/AppContext";

const C = Colors.light;

export default function SelecionarMunicipioScreen() {
  const insets = useSafeAreaInsets();
  const { selecionarMunicipio } = useApp();
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const filtrados = useMemo(() => {
    if (!busca.trim()) return MUNICIPIOS;
    const q = busca.toLowerCase();
    return MUNICIPIOS.filter(
      (m) => m.nome.toLowerCase().includes(q) || m.uf.toLowerCase().includes(q)
    );
  }, [busca]);

  const handleSelecionar = async (m: Municipio) => {
    setSelecionado(m.id);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await selecionarMunicipio(m);
    setTimeout(() => router.push("/(public)/login"), 300);
  };

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </Pressable>
        <Text style={styles.title}>Selecione seu município</Text>
        <Text style={styles.subtitle}>Encontre a prefeitura da sua cidade</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={C.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar município ou estado..."
          placeholderTextColor={C.textMuted}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="words"
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <Pressable onPress={() => setBusca("")}>
            <Ionicons name="close-circle" size={18} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomInset + 16 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtrados.length > 0}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={40} color={C.textMuted} />
            <Text style={styles.emptyText}>Nenhum município encontrado</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.municipioCard,
              selecionado === item.id && styles.municipioCardSelected,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => handleSelecionar(item)}
          >
            <View style={[styles.brasao, { backgroundColor: item.corPrimaria ?? C.primary }]}>
              <Text style={styles.brasaoText}>{item.uf}</Text>
            </View>
            <View style={styles.municipioInfo}>
              <Text style={styles.municipioNome}>{item.nome}</Text>
              <Text style={styles.municipioUF}>{item.uf} · Portal Municipal Inteligente</Text>
            </View>
            {selecionado === item.id ? (
              <Ionicons name="checkmark-circle" size={22} color={C.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
            )}
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { marginBottom: 12, padding: 4, alignSelf: "flex-start" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", color: C.text, marginBottom: 4 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: C.text,
  },
  list: { paddingHorizontal: 16 },
  municipioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  municipioCardSelected: {
    borderColor: C.primary,
    backgroundColor: C.surfaceSecondary,
  },
  brasao: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  brasaoText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
  municipioInfo: { flex: 1 },
  municipioNome: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: C.text },
  municipioUF: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: 2 },
  separator: { height: 8 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular", color: C.textSecondary },
});

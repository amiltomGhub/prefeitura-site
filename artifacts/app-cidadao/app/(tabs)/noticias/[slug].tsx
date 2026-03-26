import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useMockNews } from "@/hooks/useMockData";

const C = Colors.light;

const CAT_COLOR: Record<string, string> = {
  Saúde: "#2E7D32",
  Obras: "#E65100",
  Tributação: "#F9A825",
  Educação: "#512DA8",
  Cultura: "#C62828",
};

export default function NoticiaDetalheScreen() {
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { news } = useMockNews();

  const noticia = news.find((n) => n.slug === slug);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  if (!noticia) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: topInset }]}>
        <Ionicons name="newspaper-outline" size={48} color={C.textMuted} />
        <Text style={styles.notFoundText}>Notícia não encontrada</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtnCenter}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const catColor = CAT_COLOR[noticia.categoria] ?? C.primary;

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: noticia.color }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <View style={styles.heroContent}>
          <View style={[styles.catChip, { backgroundColor: catColor }]}>
            <Text style={styles.catChipText}>{noticia.categoria}</Text>
          </View>
          <Text style={styles.heroTitle}>{noticia.titulo}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.body, { paddingBottom: bottomInset + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={C.textSecondary} />
            <Text style={styles.metaText}>{noticia.data}</Text>
          </View>
          {noticia.autor && (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={C.textSecondary} />
              <Text style={styles.metaText}>{noticia.autor}</Text>
            </View>
          )}
        </View>

        {/* Resumo */}
        <Text style={styles.resumo}>{noticia.resumo}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Conteúdo */}
        <Text style={styles.conteudo}>{noticia.conteudo}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          <Pressable style={[styles.tag, { backgroundColor: catColor + "20" }]}>
            <Text style={[styles.tagText, { color: catColor }]}>#{noticia.categoria}</Text>
          </Pressable>
          <Pressable style={styles.tag}>
            <Text style={styles.tagText}>#PrefeituraMunicipal</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  center: { justifyContent: "center", alignItems: "center", gap: 16, flex: 1 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_500Medium", color: C.textSecondary },
  backBtnCenter: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#fff" },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 12,
    minHeight: 180,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: { gap: 10, flex: 1, justifyContent: "flex-end" },
  catChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catChipText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: 0.4 },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", lineHeight: 28 },
  body: { padding: 20, gap: 16 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary },
  resumo: { fontSize: 16, fontFamily: "Inter_500Medium", color: C.text, lineHeight: 24 },
  divider: { height: 1, backgroundColor: C.border },
  conteudo: { fontSize: 15, fontFamily: "Inter_400Regular", color: C.text, lineHeight: 24 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.borderLight,
  },
  tagText: { fontSize: 12, fontFamily: "Inter_500Medium", color: C.textSecondary },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { NewsItem, useMockNews } from "@/hooks/useMockData";

const C = Colors.light;

const CATEGORIAS = ["Todas", "Saúde", "Obras", "Tributação", "Educação", "Cultura"];

const CAT_COLOR: Record<string, string> = {
  Saúde: "#2E7D32",
  Obras: "#E65100",
  Tributação: "#F9A825",
  Educação: "#512DA8",
  Cultura: "#C62828",
};

const BG_COLORS = ["#1B5E20", "#0D47A1", "#BF360C", "#880E4F", "#1A237E", "#006064", "#4A148C", "#E65100"];

function NewsCard({ item, onPress }: { item: NewsItem; onPress: () => void }) {
  const catColor = CAT_COLOR[item.categoria] ?? C.primary;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={onPress}
    >
      <View style={[styles.cardImage, { backgroundColor: item.color }]}>
        <Ionicons name="newspaper" size={26} color="rgba(255,255,255,0.35)" />
        <View style={[styles.catBadge, { backgroundColor: catColor }]}>
          <Text style={styles.catBadgeText}>{item.categoria}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
        <Text style={styles.cardResumo} numberOfLines={2}>{item.resumo}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar-outline" size={12} color={C.textMuted} />
          <Text style={styles.cardDate}>{item.data}</Text>
          {item.autor && (
            <>
              <View style={styles.dot} />
              <Text style={styles.cardDate} numberOfLines={1}>{item.autor}</Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function NoticiasScreen() {
  const insets = useSafeAreaInsets();
  const { news, isLoading, refetch } = useMockNews();
  const [catSelecionada, setCatSelecionada] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const filtradas = useMemo(() => {
    let result = news;
    if (catSelecionada !== "Todas") result = result.filter((n) => n.categoria === catSelecionada);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      result = result.filter((n) => n.titulo.toLowerCase().includes(q) || n.resumo.toLowerCase().includes(q));
    }
    return result;
  }, [news, catSelecionada, busca]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notícias</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={15} color={C.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar notícias..."
            placeholderTextColor={C.textMuted}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <Pressable onPress={() => setBusca("")}>
              <Ionicons name="close-circle" size={15} color={C.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: 120 }]}
        scrollEnabled={filtradas.length > 0}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />
        }
        ListHeaderComponent={
          <FlatList
            horizontal
            data={CATEGORIAS}
            keyExtractor={(c) => c}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cats}
            scrollEnabled={CATEGORIAS.length > 0}
            renderItem={({ item: cat }) => (
              <Pressable
                style={[styles.catBtn, catSelecionada === cat && styles.catBtnActive]}
                onPress={() => setCatSelecionada(cat)}
              >
                <Text style={[styles.catBtnText, catSelecionada === cat && styles.catBtnTextActive]}>{cat}</Text>
              </Pressable>
            )}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={40} color={C.textMuted} />
            <Text style={styles.emptyText}>Nenhuma notícia encontrada</Text>
          </View>
        }
        renderItem={({ item }) => (
          <NewsCard
            item={item}
            onPress={() => router.push(`/(tabs)/noticias/${item.slug}` as never)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: C.text },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: C.text },
  cats: { paddingHorizontal: 20, gap: 8, paddingVertical: 12 },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  catBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  catBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.textSecondary },
  catBtnTextActive: { color: "#fff" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  card: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    gap: 0,
  },
  cardImage: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  catBadge: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    paddingVertical: 2,
    alignItems: "center",
  },
  catBadgeText: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: 0.3 },
  cardContent: { flex: 1, padding: 12, gap: 6 },
  cardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text, lineHeight: 19 },
  cardResumo: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 16 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardDate: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textMuted },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.textMuted },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular", color: C.textSecondary },
});

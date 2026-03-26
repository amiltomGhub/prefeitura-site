import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { useMockNews, useMockServicos, useMockAgenda } from "@/hooks/useMockData";

const C = Colors.light;

const ACESSO_RAPIDO = [
  { icon: "megaphone-outline" as const, label: "Ouvidoria", color: "#E53935", bg: "#FFEBEE", route: "/ouvidoria" as never },
  { icon: "document-text-outline" as const, label: "SIC", color: "#6D4C41", bg: "#EFEBE9", route: "/servicos" as never },
  { icon: "receipt-outline" as const, label: "IPTU", color: "#F57C00", bg: "#FFF3E0", route: "/servicos" as never },
  { icon: "newspaper-outline" as const, label: "Notícias", color: "#1565C0", bg: "#E3F2FD", route: "/noticias" as never },
  { icon: "calendar-outline" as const, label: "Agenda", color: "#2E7D32", bg: "#E8F5E9", route: "/servicos" as never },
  { icon: "map-outline" as const, label: "Mapa", color: "#6A1B9A", bg: "#F3E5F5", route: "/mapa" as const },
];

function SkeletonCard({ w, h }: { w: number; h: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={{ width: w, height: h, borderRadius: 12, backgroundColor: C.border, opacity: anim }} />;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { usuario, municipio, manifestacoes } = useApp();
  const { news, isLoading: newsLoading, refetch: refetchNews } = useMockNews();
  const { servicos } = useMockServicos();
  const { agenda } = useMockAgenda();
  const [refreshing, setRefreshing] = React.useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchNews();
    setRefreshing(false);
  };

  const ultimaManifestacao = manifestacoes[0];
  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Cidadão";

  const statusColor = {
    aberta: C.warning,
    em_analise: C.primary,
    respondida: C.success,
    arquivada: C.textSecondary,
  };

  const statusLabel = {
    aberta: "Aberta",
    em_analise: "Em análise",
    respondida: "Respondida",
    arquivada: "Arquivada",
  };

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[C.primaryDark, C.primary, C.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroHeader, { paddingTop: topInset + 16 }]}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Olá, {primeiroNome}!</Text>
            <View style={styles.municipioRow}>
              <Ionicons name="business" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={styles.municipioLabel}>{municipio?.nome} · {municipio?.uf}</Text>
            </View>
          </View>
          <View style={styles.heroActions}>
            <Pressable
              style={styles.iconBtn}
              onPress={() => router.push("/notificacoes")}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => router.push("/(tabs)/perfil")}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarSmallText}>{primeiroNome[0]}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Search bar */}
        <Pressable style={styles.searchBar} onPress={() => {}}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.6)" />
          <Text style={styles.searchPlaceholder}>Buscar serviços, notícias...</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.body}>
        {/* Acesso Rápido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          <View style={styles.quickGrid}>
            {ACESSO_RAPIDO.map((item) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [styles.quickItem, pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }]}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(item.route as never);
                }}
              >
                <View style={[styles.quickIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Última manifestação */}
        {ultimaManifestacao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minha última manifestação</Text>
            <Pressable
              style={({ pressed }) => [styles.manifestacaoCard, pressed && { opacity: 0.9 }]}
              onPress={() => router.push("/ouvidoria" as never)}
            >
              <View style={styles.manifestacaoHeader}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor[ultimaManifestacao.status] + "20" }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor[ultimaManifestacao.status] }]} />
                  <Text style={[styles.statusText, { color: statusColor[ultimaManifestacao.status] }]}>
                    {statusLabel[ultimaManifestacao.status]}
                  </Text>
                </View>
                <Text style={styles.protocolo}>#{ultimaManifestacao.protocolo}</Text>
              </View>
              <Text style={styles.manifestacaoTitulo} numberOfLines={2}>{ultimaManifestacao.titulo}</Text>
              <Text style={styles.manifestacaoData}>
                {new Date(ultimaManifestacao.dataAbertura).toLocaleDateString("pt-BR")} · {ultimaManifestacao.tipo}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Notícias */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notícias</Text>
            <Pressable onPress={() => router.push("/(tabs)/noticias/index")}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </Pressable>
          </View>
          {newsLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ gap: 12 }}>
              {[1, 2, 3].map((k) => <SkeletonCard key={k} w={240} h={160} />)}
            </ScrollView>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={news.slice(0, 5)}
              keyExtractor={(item) => item.id}
              scrollEnabled={news.length > 0}
              contentContainerStyle={{ gap: 12, paddingRight: 20 }}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.newsCard, pressed && { opacity: 0.9 }]}
                  onPress={() => router.push(`/(tabs)/noticias/${item.slug}` as never)}
                >
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.75)"]}
                    style={styles.newsGradient}
                  />
                  <View style={[styles.newsImageBg, { backgroundColor: item.color }]}>
                    <Ionicons name="newspaper" size={32} color="rgba(255,255,255,0.4)" />
                  </View>
                  <View style={styles.newsContent}>
                    <View style={styles.newsCategoryBadge}>
                      <Text style={styles.newsCategoryText}>{item.categoria}</Text>
                    </View>
                    <Text style={styles.newsTitle} numberOfLines={2}>{item.titulo}</Text>
                    <Text style={styles.newsDate}>{item.data}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>

        {/* Próximos eventos */}
        <View style={[styles.section, { marginBottom: 120 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <Pressable>
              <Text style={styles.seeAll}>Ver agenda</Text>
            </Pressable>
          </View>
          {agenda.slice(0, 3).map((ev) => (
            <View key={ev.id} style={styles.eventoItem}>
              <View style={styles.eventoData}>
                <Text style={styles.eventoDay}>{ev.dia}</Text>
                <Text style={styles.eventoMes}>{ev.mes}</Text>
              </View>
              <View style={styles.eventoInfo}>
                <Text style={styles.eventoTitulo} numberOfLines={1}>{ev.titulo}</Text>
                <View style={styles.eventoMeta}>
                  <Ionicons name="time-outline" size={12} color={C.textSecondary} />
                  <Text style={styles.eventoMetaText}>{ev.hora}</Text>
                  <Ionicons name="location-outline" size={12} color={C.textSecondary} />
                  <Text style={styles.eventoMetaText} numberOfLines={1}>{ev.local}</Text>
                </View>
              </View>
              <View style={[styles.eventoCat, { backgroundColor: ev.catColor + "20" }]}>
                <Text style={[styles.eventoCatText, { color: ev.catColor }]}>{ev.catLabel}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  heroHeader: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroGreeting: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  municipioRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  municipioLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  heroActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmallText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  searchPlaceholder: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  body: { padding: 20, gap: 28 },
  section: { gap: 14 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: C.text },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.primary },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickItem: {
    width: "30%",
    alignItems: "center",
    gap: 8,
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: C.text, textAlign: "center" },
  manifestacaoCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  manifestacaoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  protocolo: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary },
  manifestacaoTitulo: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: C.text, lineHeight: 20 },
  manifestacaoData: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary },
  newsCard: {
    width: 220,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: C.border,
  },
  newsImageBg: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  newsGradient: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },
  newsContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    zIndex: 2,
    gap: 4,
  },
  newsCategoryBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newsCategoryText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#fff" },
  newsTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff", lineHeight: 18 },
  newsDate: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  eventoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  eventoData: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  eventoDay: { fontSize: 18, fontFamily: "Inter_700Bold", color: C.primary, lineHeight: 22 },
  eventoMes: { fontSize: 10, fontFamily: "Inter_500Medium", color: C.primary },
  eventoInfo: { flex: 1, gap: 4 },
  eventoTitulo: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text },
  eventoMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  eventoMetaText: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textSecondary },
  eventoCat: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  eventoCatText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
});

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { Manifestacao, useApp } from "@/contexts/AppContext";

const C = Colors.light;

const TIPO_LABEL: Record<string, string> = {
  reclamacao: "Reclamação",
  denuncia: "Denúncia",
  sugestao: "Sugestão",
  elogio: "Elogio",
  solicitacao: "Solicitação",
};

const TIPO_CONFIG: Record<string, { icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap; bg: string; color: string }> = {
  reclamacao: { icon: "alert-circle-outline", bg: "#FEE2E2", color: "#DC2626" },
  denuncia: { icon: "warning-outline", bg: "#FFF3CD", color: "#B45309" },
  sugestao: { icon: "bulb-outline", bg: "#DCFCE7", color: "#16A34A" },
  elogio: { icon: "heart-outline", bg: "#FDF4FF", color: "#9333EA" },
  solicitacao: { icon: "hand-left-outline", bg: "#E0F2FE", color: "#0369A1" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  aberta: { label: "Aberta", color: "#D97706", bg: "#FEF3C7" },
  em_analise: { label: "Em análise", color: "#1D4ED8", bg: "#DBEAFE" },
  respondida: { label: "Respondida", color: "#15803D", bg: "#DCFCE7" },
  arquivada: { label: "Arquivada", color: "#6B7280", bg: "#F3F4F6" },
};

const URGENCIA_CONFIG = {
  normal: { label: "Normal", color: C.textSecondary },
  urgente: { label: "Urgente", color: "#D97706" },
  emergencia: { label: "Emergência", color: "#DC2626" },
};

function ManifestacaoCard({ item }: { item: Manifestacao }) {
  const tipo = TIPO_CONFIG[item.tipo] ?? TIPO_CONFIG.solicitacao;
  const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.aberta;
  const urgencia = URGENCIA_CONFIG[item.urgencia];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={styles.cardTop}>
        <View style={[styles.tipoIcon, { backgroundColor: tipo.bg }]}>
          <Ionicons name={tipo.icon} size={18} color={tipo.color} />
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.cardProtocolo}>#{item.protocolo}</Text>
          <Text style={styles.cardTipo}>{TIPO_LABEL[item.tipo]}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
      <Text style={styles.cardTitulo} numberOfLines={2}>{item.titulo}</Text>
      <View style={styles.cardBottom}>
        <View style={styles.cardDate}>
          <Ionicons name="calendar-outline" size={12} color={C.textMuted} />
          <Text style={styles.cardDateText}>
            {new Date(item.dataAbertura).toLocaleDateString("pt-BR")}
          </Text>
        </View>
        {item.urgencia !== "normal" && (
          <View style={styles.urgBadge}>
            <Ionicons name="alert" size={11} color={urgencia.color} />
            <Text style={[styles.urgText, { color: urgencia.color }]}>{urgencia.label}</Text>
          </View>
        )}
        {item.pendingSync && (
          <View style={styles.syncBadge}>
            <Ionicons name="cloud-upload-outline" size={12} color={C.warning} />
            <Text style={styles.syncText}>Pendente</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={14} color={C.textMuted} style={{ marginLeft: "auto" }} />
      </View>
    </Pressable>
  );
}

export default function OuvidoriaHubScreen() {
  const insets = useSafeAreaInsets();
  const { manifestacoes, isAuthenticated } = useApp();

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const stats = {
    total: manifestacoes.length,
    emAnalise: manifestacoes.filter((m) => m.status === "em_analise").length,
    respondidas: manifestacoes.filter((m) => m.status === "respondida").length,
  };

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ouvidoria</Text>
          <Text style={styles.headerSub}>Canal direto com a Prefeitura</Text>
        </View>
      </View>

      {isAuthenticated && manifestacoes.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMid]}>
            <Text style={[styles.statNum, { color: C.primary }]}>{stats.emAnalise}</Text>
            <Text style={styles.statLabel}>Em análise</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: C.success }]}>{stats.respondidas}</Text>
            <Text style={styles.statLabel}>Respondidas</Text>
          </View>
        </View>
      )}

      <FlatList
        data={manifestacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={manifestacoes.length > 0}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>
              {manifestacoes.length > 0 ? "Minhas Manifestações" : ""}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="megaphone-outline" size={40} color={C.primary} />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma manifestação</Text>
            <Text style={styles.emptyDesc}>
              Sua voz importa! Registre reclamações, sugestões ou elogios à Prefeitura.
            </Text>
          </View>
        }
        renderItem={({ item }) => <ManifestacaoCard item={item} />}
      />

      <View style={[styles.fab, { bottom: Platform.OS === "web" ? 34 + 84 + 16 : insets.bottom + 84 + 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.fabBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (!isAuthenticated) {
              router.push("/(public)/login");
              return;
            }
            router.push("/(tabs)/ouvidoria/nova");
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.fabText}>Nova Manifestação</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: C.text },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: 2 },
  statsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  statCardMid: {
    borderColor: C.primary + "40",
    backgroundColor: C.surfaceSecondary,
  },
  statNum: { fontSize: 22, fontFamily: "Inter_700Bold", color: C.text },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  listHeader: { paddingVertical: 4 },
  listHeaderTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: C.textSecondary },
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  tipoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  cardMeta: { flex: 1 },
  cardProtocolo: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textMuted },
  cardTipo: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cardTitulo: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.text, lineHeight: 20 },
  cardBottom: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardDate: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardDateText: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textMuted },
  urgBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  urgText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  syncBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  syncText: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.warning },
  emptyState: { alignItems: "center", paddingTop: 60, paddingHorizontal: 32, gap: 12 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: C.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: C.text },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary, textAlign: "center", lineHeight: 20 },
  fab: { position: "absolute", left: 20, right: 20 },
  fabBtn: {
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});

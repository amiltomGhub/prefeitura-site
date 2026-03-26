import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

const C = Colors.light;

interface NotifItem {
  id: string;
  tipo: "manifestacao" | "noticia" | "alerta" | "tributo" | "agenda";
  titulo: string;
  mensagem: string;
  hora: string;
  lida: boolean;
}

const MOCK_NOTIFS: NotifItem[] = [
  { id: "1", tipo: "manifestacao", titulo: "Manifestação atualizada", mensagem: "Sua manifestação OUV-2026-123456 foi recebida e está em análise.", hora: "14:32", lida: false },
  { id: "2", tipo: "alerta", titulo: "Alerta emergencial", mensagem: "Interdição na Av. Principal entre Rua A e Rua B por obras. Desvio disponível.", hora: "11:05", lida: false },
  { id: "3", tipo: "noticia", titulo: "Nova notícia publicada", mensagem: "Campanha de vacinação contra gripe começa segunda-feira.", hora: "09:20", lida: true },
  { id: "4", tipo: "tributo", titulo: "IPTU 2026 — Vencimento", mensagem: "O prazo para pagamento com 10% de desconto vence em 30/04.", hora: "08:00", lida: true },
  { id: "5", tipo: "agenda", titulo: "Evento amanhã", mensagem: "Audiência Pública — PPA 2026-2029 às 14h na Câmara Municipal.", hora: "Ontem", lida: true },
  { id: "6", tipo: "manifestacao", titulo: "Resposta recebida", mensagem: "A Prefeitura respondeu à sua manifestação sobre iluminação pública.", hora: "Ontem", lida: true },
];

const TIPO_CONFIG: Record<NotifItem["tipo"], { icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap; bg: string; color: string }> = {
  manifestacao: { icon: "megaphone-outline", bg: "#DBEAFE", color: "#1D4ED8" },
  noticia: { icon: "newspaper-outline", bg: "#F0FDF4", color: "#15803D" },
  alerta: { icon: "warning-outline", bg: "#FEF3C7", color: "#B45309" },
  tributo: { icon: "receipt-outline", bg: "#FFF7ED", color: "#C2410C" },
  agenda: { icon: "calendar-outline", bg: "#F5F3FF", color: "#7C3AED" },
};

export default function NotificacoesScreen() {
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs] = useState<NotifItem[]>(MOCK_NOTIFS);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const naoLidas = notifs.filter((n) => !n.lida).length;

  const marcarTodasLidas = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const marcarLida = (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  };

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Notificações</Text>
          {naoLidas > 0 && <Text style={styles.headerSub}>{naoLidas} não lida{naoLidas > 1 ? "s" : ""}</Text>}
        </View>
        {naoLidas > 0 && (
          <Pressable onPress={marcarTodasLidas} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            <Text style={styles.markAllText}>Marcar todas</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={notifs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={notifs.length > 0}
        contentContainerStyle={{ paddingBottom: bottomInset + 20 }}
        renderItem={({ item }) => {
          const cfg = TIPO_CONFIG[item.tipo];
          return (
            <Pressable
              style={({ pressed }) => [
                styles.notifItem,
                !item.lida && styles.notifItemUnread,
                pressed && { opacity: 0.9 },
              ]}
              onPress={() => marcarLida(item.id)}
            >
              <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={18} color={cfg.color} />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitulo}>{item.titulo}</Text>
                  {!item.lida && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMensagem} numberOfLines={2}>{item.mensagem}</Text>
                <Text style={styles.notifHora}>{item.hora}</Text>
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color={C.textMuted} />
            <Text style={styles.emptyText}>Sem notificações</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: C.text },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary },
  markAllText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.primary },
  notifItem: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: C.surface,
  },
  notifItemUnread: { backgroundColor: "#EEF2FF" },
  notifIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  notifContent: { flex: 1, gap: 3 },
  notifHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  notifTitulo: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  notifMensagem: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 18 },
  notifHora: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textMuted },
  separator: { height: 1, backgroundColor: C.border },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular", color: C.textSecondary },
});

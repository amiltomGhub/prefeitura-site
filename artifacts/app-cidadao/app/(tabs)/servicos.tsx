import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
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
import { useMockServicos, ServicoItem } from "@/hooks/useMockData";

const C = Colors.light;

const CATEGORIAS = ["Todos", "Documentos", "Licenças", "Tributação", "Saúde", "Educação", "Infraestrutura", "Meio Ambiente", "Transparência"];

const ICONE_MAP: Record<string, keyof typeof import("@expo/vector-icons").Ionicons.glyphMap> = {
  "home-outline": "home-outline",
  "business-outline": "business-outline",
  "receipt-outline": "receipt-outline",
  "document-text-outline": "document-text-outline",
  "medical-outline": "medkit-outline",
  "school-outline": "school-outline",
  "leaf-outline": "leaf-outline",
  "bulb-outline": "bulb-outline",
};

const CAT_COLOR: Record<string, { bg: string; color: string }> = {
  Documentos: { bg: "#E3F2FD", color: "#1565C0" },
  Licenças: { bg: "#FFF3E0", color: "#E65100" },
  Tributação: { bg: "#FFF8E1", color: "#F9A825" },
  Saúde: { bg: "#E8F5E9", color: "#2E7D32" },
  Educação: { bg: "#EDE7F6", color: "#512DA8" },
  Infraestrutura: { bg: "#EFEBE9", color: "#6D4C41" },
  "Meio Ambiente": { bg: "#F1F8E9", color: "#558B2F" },
  Transparência: { bg: "#E8EAF6", color: "#3949AB" },
};

function ServicoCard({ item, onPress }: { item: ServicoItem; onPress: () => void }) {
  const cat = CAT_COLOR[item.categoria] ?? { bg: C.surfaceSecondary, color: C.primary };
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
      onPress={onPress}
    >
      <View style={[styles.cardIconBg, { backgroundColor: cat.bg }]}>
        <Ionicons name={ICONE_MAP[item.icone] ?? "apps-outline"} size={22} color={cat.color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.descricao}</Text>
        <View style={styles.cardMeta}>
          <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
            <Text style={[styles.catText, { color: cat.color }]}>{item.categoria}</Text>
          </View>
          {item.prazo && (
            <View style={styles.prazoBadge}>
              <Ionicons name="time-outline" size={11} color={C.textSecondary} />
              <Text style={styles.prazoText}>{item.prazo}</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
    </Pressable>
  );
}

function ServicoModal({ item, onClose }: { item: ServicoItem; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const cat = CAT_COLOR[item.categoria] ?? { bg: C.surfaceSecondary, color: C.primary };
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={[styles.modal, { paddingBottom: bottomInset + 20 }]}>
        <View style={styles.modalHandle} />
        <View style={styles.modalHeader}>
          <View style={[styles.modalIcon, { backgroundColor: cat.bg }]}>
            <Ionicons name={ICONE_MAP[item.icone] ?? "apps-outline"} size={28} color={cat.color} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.modalTitle}>{item.titulo}</Text>
            <Text style={styles.modalSecretaria}>{item.secretaria}</Text>
          </View>
          <Pressable onPress={onClose} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
            <Ionicons name="close" size={22} color={C.text} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
          <Text style={styles.modalDesc}>{item.descricao}</Text>

          {item.prazo && (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={C.primary} />
              <Text style={styles.infoLabel}>Prazo:</Text>
              <Text style={styles.infoValue}>{item.prazo}</Text>
            </View>
          )}

          {item.documentos && item.documentos.length > 0 && (
            <View style={styles.docSection}>
              <Text style={styles.docTitle}>Documentos necessários</Text>
              {item.documentos.map((doc, i) => (
                <View key={i} style={styles.docItem}>
                  <Ionicons name="checkmark-circle" size={16} color={C.success} />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <Pressable
          style={({ pressed }) => [styles.solicitarBtn, pressed && { opacity: 0.9 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert("Serviço", "Redirecionando para o portal web ou agendamento online.");
          }}
        >
          <Ionicons name="arrow-forward-circle" size={20} color="#fff" />
          <Text style={styles.solicitarBtnText}>Solicitar serviço</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ServicosScreen() {
  const insets = useSafeAreaInsets();
  const { servicos } = useMockServicos();
  const [catSelecionada, setCatSelecionada] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [selectedItem, setSelectedItem] = useState<ServicoItem | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const filtrados = useMemo(() => {
    let result = servicos;
    if (catSelecionada !== "Todos") result = result.filter((s) => s.categoria === catSelecionada);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      result = result.filter((s) => s.titulo.toLowerCase().includes(q) || s.descricao.toLowerCase().includes(q));
    }
    return result;
  }, [servicos, catSelecionada, busca]);

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Serviços Municipais</Text>
        <Text style={styles.headerSub}>{servicos.length} serviços disponíveis</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={C.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar serviço..."
            placeholderTextColor={C.textMuted}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <Pressable onPress={() => setBusca("")}>
              <Ionicons name="close-circle" size={16} color={C.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsScroll} contentContainerStyle={styles.cats}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.catBtn, catSelecionada === cat && styles.catBtnActive]}
            onPress={() => { Haptics.selectionAsync(); setCatSelecionada(cat); }}
          >
            <Text style={[styles.catBtnText, catSelecionada === cat && styles.catBtnTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtrados.length > 0}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={C.textMuted} />
            <Text style={styles.emptyText}>Nenhum serviço encontrado</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ServicoCard
            item={item}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedItem(item);
            }}
          />
        )}
      />

      {selectedItem && (
        <ServicoModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: C.text },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: 2 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: C.text },
  catsScroll: { maxHeight: 42 },
  cats: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  catBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  catBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.textSecondary },
  catBtnTextActive: { color: "#fff" },
  list: { padding: 16, paddingBottom: 120 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardIconBg: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text },
  cardDesc: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 16 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  catText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  prazoBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  prazoText: { fontSize: 10, fontFamily: "Inter_400Regular", color: C.textSecondary },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular", color: C.textSecondary },
  // Modal
  modalOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", zIndex: 100 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  modal: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
    zIndex: 101,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center",
    marginBottom: 4,
  },
  modalHeader: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  modalIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: C.text, flex: 1, lineHeight: 22 },
  modalSecretaria: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary },
  closeBtn: { padding: 4, marginTop: -2 },
  modalDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 20, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  infoLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text },
  infoValue: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary },
  docSection: { gap: 10 },
  docTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: C.text },
  docItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  docText: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.text },
  solicitarBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  solicitarBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});

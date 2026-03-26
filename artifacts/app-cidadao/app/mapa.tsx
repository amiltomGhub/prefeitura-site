import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MapaView, { MapaPonto } from "@/components/MapaView";
import Colors from "@/constants/colors";

const C = Colors.light;

type CamadaId = "ocorrencias" | "obras" | "servicos" | "coleta";

const CAMADAS: { id: CamadaId; label: string; color: string; icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap }[] = [
  { id: "ocorrencias", label: "Ocorrências", color: "#DC2626", icon: "alert-circle" },
  { id: "obras", label: "Obras", color: "#D97706", icon: "construct" },
  { id: "servicos", label: "Serviços", color: "#2563EB", icon: "business" },
  { id: "coleta", label: "Coleta", color: "#16A34A", icon: "leaf" },
];

const CAMADA_COLOR: Record<CamadaId, string> = {
  ocorrencias: "#DC2626",
  obras: "#D97706",
  servicos: "#2563EB",
  coleta: "#16A34A",
};

const TODOS_PONTOS: MapaPonto[] = [
  { id: "1", tipo: "ocorrencias", titulo: "Buraco na via", desc: "Via pública com problema", lat: -6.0842, lng: -49.9603 },
  { id: "2", tipo: "obras", titulo: "Obra de pavimentação", desc: "Previsão: 30/06/2026", lat: -6.0862, lng: -49.9573 },
  { id: "3", tipo: "servicos", titulo: "UBS Centro", desc: "Unidade Básica de Saúde", lat: -6.0872, lng: -49.9623 },
  { id: "4", tipo: "servicos", titulo: "CRAS Municipal", desc: "Centro de Referência Social", lat: -6.0852, lng: -49.9643 },
  { id: "5", tipo: "coleta", titulo: "Ponto de Coleta Seletiva", desc: "Seg/Qua/Sex - 7h às 18h", lat: -6.0832, lng: -49.9593 },
  { id: "6", tipo: "ocorrencias", titulo: "Iluminação com falha", desc: "Poste sem funcionamento", lat: -6.0892, lng: -49.9583 },
  { id: "7", tipo: "obras", titulo: "Construção da Praça", desc: "Em andamento", lat: -6.0822, lng: -49.9613 },
];

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const [camadasAtivas, setCamadasAtivas] = useState<Set<CamadaId>>(
    new Set(["ocorrencias", "obras", "servicos", "coleta"])
  );

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const toggleCamada = (id: CamadaId) => {
    setCamadasAtivas((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const pontosFiltrados = TODOS_PONTOS.filter((p) => camadasAtivas.has(p.tipo as CamadaId));

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Mapa de Serviços</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Map area */}
      <View style={styles.mapContainer}>
        <MapaView pontos={pontosFiltrados} camadasColor={CAMADA_COLOR} />
      </View>

      {/* Camadas */}
      <View style={[styles.camadasPanel, { paddingBottom: bottomInset + 12 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.camadasRow}
        >
          {CAMADAS.map((c) => (
            <Pressable
              key={c.id}
              style={[
                styles.camadaBtn,
                camadasAtivas.has(c.id) && { backgroundColor: c.color, borderColor: c.color },
              ]}
              onPress={() => toggleCamada(c.id)}
            >
              <Ionicons
                name={c.icon}
                size={14}
                color={camadasAtivas.has(c.id) ? "#fff" : c.color}
              />
              <Text style={[styles.camadaText, camadasAtivas.has(c.id) && { color: "#fff" }]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.background,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: C.text },
  mapContainer: { flex: 1, position: "relative" },
  camadasPanel: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  camadasRow: { gap: 8 },
  camadaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  camadaText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: C.text },
});

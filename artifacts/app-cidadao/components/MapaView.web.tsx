import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

const C = Colors.light;

export interface MapaPonto {
  id: string;
  tipo: string;
  titulo: string;
  desc: string;
  lat: number;
  lng: number;
}

interface Props {
  pontos: MapaPonto[];
}

export default function MapaView({ pontos }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={52} color={C.textMuted} />
      <Text style={styles.title}>Mapa disponível no app nativo</Text>
      <Text style={styles.sub}>Baixe o App Cidadão no iOS ou Android</Text>
      <Text style={styles.count}>{pontos.length} ponto{pontos.length !== 1 ? "s" : ""} no mapa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  title: { fontSize: 16, fontFamily: "Inter_500Medium", color: C.textSecondary },
  sub: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textMuted },
  count: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textMuted },
});

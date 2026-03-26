import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { Text } from "react-native";

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
  camadasColor: Record<string, string>;
}

export default function MapaView({ pontos, camadasColor }: Props) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: -6.0852,
        longitude: -49.9613,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
      showsUserLocation
      showsMyLocationButton
    >
      {pontos.map((ponto) => (
        <Marker
          key={ponto.id}
          coordinate={{ latitude: ponto.lat, longitude: ponto.lng }}
          pinColor={camadasColor[ponto.tipo]}
        >
          <Callout tooltip>
            <View style={styles.calloutBox}>
              <Text style={styles.calloutTitle}>{ponto.titulo}</Text>
              <Text style={styles.calloutDesc}>{ponto.desc}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  calloutBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    gap: 2,
    maxWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  calloutTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: C.text },
  calloutDesc: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textSecondary },
});

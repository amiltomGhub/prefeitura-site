import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const { width, height } = Dimensions.get("window");
const C = Colors.light;

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const logoAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <LinearGradient
      colors={[C.primaryDark, C.primary, C.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.inner, { paddingTop: topInset + 60, paddingBottom: bottomInset + 40 }]}>
        <Animated.View style={[styles.logoSection, { opacity: logoAnim, transform: [{ scale: logoAnim }] }]}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={52} color="#fff" />
          </View>
          <Text style={styles.appTitle}>Portal Municipal</Text>
          <Text style={styles.appSubtitle}>Cidadão Conectado</Text>
        </Animated.View>

        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.featureRow}>
            {[
              { icon: "megaphone-outline" as const, label: "Ouvidoria" },
              { icon: "newspaper-outline" as const, label: "Notícias" },
              { icon: "map-outline" as const, label: "Serviços" },
              { icon: "shield-checkmark-outline" as const, label: "Transparência" },
            ].map((f) => (
              <View key={f.label} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={22} color={C.primaryLight} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push("/(public)/selecionar-municipio")}
          >
            <Text style={styles.btnPrimaryText}>Começar</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.7 }]}
            onPress={() => router.push("/(public)/login")}
          >
            <Text style={styles.btnSecondaryText}>Já tenho conta</Text>
          </Pressable>

          <Text style={styles.footerText}>Governo Digital Brasileiro</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  appTitle: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.3,
  },
  bottomSection: {
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  featureItem: {
    alignItems: "center",
    gap: 6,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
  },
  btnPrimary: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimaryText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: C.primary,
  },
  btnSecondary: {
    paddingVertical: 14,
    alignItems: "center",
  },
  btnSecondaryText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.85)",
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    marginTop: 4,
  },
});

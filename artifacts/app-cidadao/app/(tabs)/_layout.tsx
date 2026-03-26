import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Redirect, Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

const C = Colors.light;

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Início</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="servicos">
        <Icon sf={{ default: "list.bullet", selected: "list.bullet" }} />
        <Label>Serviços</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ouvidoria/index">
        <Icon sf={{ default: "megaphone", selected: "megaphone.fill" }} />
        <Label>Ouvidoria</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="noticias/index">
        <Icon sf={{ default: "newspaper", selected: "newspaper.fill" }} />
        <Label>Notícias</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="perfil">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Perfil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : "#fff",
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: C.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#fff" }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_500Medium",
          marginBottom: Platform.OS === "ios" ? 0 : 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          title: "Serviços",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="list.bullet" tintColor={color} size={24} />
            ) : (
              <Ionicons name="grid-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="ouvidoria/index"
        options={{
          title: "Ouvidoria",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="megaphone.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="megaphone-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="noticias/index"
        options={{
          title: "Notícias",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="newspaper.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="newspaper-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person.fill" tintColor={color} size={24} />
            ) : (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen name="ouvidoria/nova" options={{ href: null }} />
      <Tabs.Screen name="noticias/[slug]" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  const { isLoading, municipio } = useApp();
  if (isLoading) return null;
  if (!municipio) return <Redirect href="/(public)/selecionar-municipio" />;

  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

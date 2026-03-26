import { Redirect, Stack } from "expo-router";
import React from "react";

import { useApp } from "@/contexts/AppContext";

export default function PublicLayout() {
  const { isAuthenticated, municipio, isLoading } = useApp();

  if (isLoading) return null;

  if (isAuthenticated && municipio) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="selecionar-municipio" />
    </Stack>
  );
}

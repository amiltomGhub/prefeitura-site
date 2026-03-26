import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
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
import { useApp } from "@/contexts/AppContext";

const C = Colors.light;

const TIPOS = [
  { id: "reclamacao", label: "Reclamação", icon: "alert-circle-outline" as const, color: "#DC2626", bg: "#FEE2E2", desc: "Inconformidade com serviço" },
  { id: "denuncia", label: "Denúncia", icon: "warning-outline" as const, color: "#B45309", bg: "#FFF3CD", desc: "Irregularidade ou ilegalidade" },
  { id: "sugestao", label: "Sugestão", icon: "bulb-outline" as const, color: "#16A34A", bg: "#DCFCE7", desc: "Melhoria de serviço" },
  { id: "elogio", label: "Elogio", icon: "heart-outline" as const, color: "#9333EA", bg: "#FDF4FF", desc: "Reconhecimento positivo" },
  { id: "solicitacao", label: "Solicitação", icon: "hand-left-outline" as const, color: "#0369A1", bg: "#E0F2FE", desc: "Pedido de serviço" },
];

const CATEGORIAS = [
  "Saúde", "Educação", "Trânsito", "Iluminação Pública", "Zeladoria",
  "Meio Ambiente", "Obras e Infraestrutura", "Transporte Público", "Segurança", "Outros",
];

const URGENCIAS = [
  { id: "normal", label: "Normal", color: C.textSecondary, desc: "Prazo padrão" },
  { id: "urgente", label: "Urgente", color: C.warning, desc: "Atenção necessária" },
  { id: "emergencia", label: "Emergência", color: C.error, desc: "Risco à vida/saúde" },
] as const;

type Step = 1 | 2 | 3 | 4;

export default function NovaManifestaocaoScreen() {
  const insets = useSafeAreaInsets();
  const { adicionarManifestacao } = useApp();

  const [step, setStep] = useState<Step>(1);
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState<"normal" | "urgente" | "emergencia">("normal");
  const [anonimo, setAnonimo] = useState(false);
  const [lgpd, setLgpd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [protocolo, setProtocolo] = useState("");

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const tipoSelecionado = TIPOS.find((t) => t.id === tipo);

  const canAdvance1 = !!tipo && !!categoria;
  const canAdvance2 = titulo.trim().length >= 10 && descricao.trim().length >= 20;
  const canSubmit = lgpd;

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!lgpd) {
      Alert.alert("LGPD", "Aceite os termos de privacidade para continuar.");
      return;
    }
    setIsLoading(true);
    try {
      const m = await adicionarManifestacao({
        tipo: tipo as "reclamacao" | "denuncia" | "sugestao" | "elogio" | "solicitacao",
        categoria,
        titulo,
        descricao,
        status: "aberta",
        urgencia,
      });
      setProtocolo(m.protocolo);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep(4);
    } catch {
      Alert.alert("Erro", "Não foi possível enviar. A manifestação foi salva localmente.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressWidth = `${(step / 4) * 100}%` as const;

  if (step === 4) {
    return (
      <View style={[styles.container, styles.successContainer, { paddingTop: topInset }]}>
        <View style={styles.successInner}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={C.success} />
          </View>
          <Text style={styles.successTitle}>Manifestação registrada!</Text>
          <Text style={styles.successDesc}>
            Sua manifestação foi recebida com sucesso. Use o protocolo para acompanhar.
          </Text>
          <View style={styles.protocoloBox}>
            <Text style={styles.protocoloLabel}>Número do Protocolo</Text>
            <Text style={styles.protocoloNum}>{protocolo}</Text>
            <Pressable
              style={styles.copyBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert("Copiado!", "Protocolo copiado para a área de transferência.");
              }}
            >
              <Ionicons name="copy-outline" size={16} color={C.primary} />
              <Text style={styles.copyBtnText}>Copiar</Text>
            </Pressable>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color={C.primary} />
            <Text style={styles.infoText}>
              Prazo de resposta: até 20 dias úteis, conforme a Lei de Acesso à Informação.
            </Text>
          </View>
        </View>
        <View style={[styles.successActions, { paddingBottom: bottomInset + 20 }]}>
          <Pressable
            style={styles.btnPrimary}
            onPress={() => router.replace("/ouvidoria" as never)}
          >
            <Text style={styles.btnPrimaryText}>Ver minhas manifestações</Text>
          </Pressable>
          <Pressable
            style={styles.btnSecondary}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.btnSecondaryText}>Voltar ao início</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topInset }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => { if (step > 1) setStep((p) => (p - 1) as Step); else router.back(); }} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Nova Manifestação</Text>
          <Text style={styles.headerSub}>Passo {step} de 3</Text>
        </View>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
          <Ionicons name="close" size={24} color={C.textSecondary} />
        </Pressable>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: progressWidth as never }]} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.form, { paddingBottom: bottomInset + 80 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1 */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tipo e Categoria</Text>
            <Text style={styles.stepDesc}>Selecione o tipo de manifestação</Text>

            <View style={styles.tiposGrid}>
              {TIPOS.map((t) => (
                <Pressable
                  key={t.id}
                  style={({ pressed }) => [
                    styles.tipoCard,
                    tipo === t.id && { borderColor: t.color, borderWidth: 2, backgroundColor: t.bg },
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                  onPress={() => { Haptics.selectionAsync(); setTipo(t.id); }}
                >
                  <View style={[styles.tipoIcon, { backgroundColor: tipo === t.id ? t.bg : C.borderLight }]}>
                    <Ionicons name={t.icon} size={26} color={tipo === t.id ? t.color : C.textSecondary} />
                  </View>
                  <Text style={[styles.tipoLabel, tipo === t.id && { color: t.color, fontFamily: "Inter_700Bold" }]}>{t.label}</Text>
                  <Text style={styles.tipoDesc}>{t.desc}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: 8 }]}>Categoria</Text>
            <View style={styles.categoriasGrid}>
              {CATEGORIAS.map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.catBtn, categoria === cat && styles.catBtnActive]}
                  onPress={() => { Haptics.selectionAsync(); setCategoria(cat); }}
                >
                  <Text style={[styles.catBtnText, categoria === cat && styles.catBtnTextActive]}>{cat}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <View style={styles.stepContent}>
            {tipoSelecionado && (
              <View style={[styles.tipoSelectedBanner, { backgroundColor: tipoSelecionado.bg }]}>
                <Ionicons name={tipoSelecionado.icon} size={18} color={tipoSelecionado.color} />
                <Text style={[styles.tipoSelectedText, { color: tipoSelecionado.color }]}>
                  {tipoSelecionado.label} · {categoria}
                </Text>
              </View>
            )}

            <Text style={styles.stepTitle}>Detalhes</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Título *</Text>
              <TextInput
                style={[styles.textInput, titulo.length > 0 && titulo.length < 10 && styles.inputError]}
                placeholder="Descreva o problema em poucas palavras (mín. 10 chars)"
                placeholderTextColor={C.textMuted}
                value={titulo}
                onChangeText={setTitulo}
                maxLength={120}
              />
              <Text style={styles.charCount}>{titulo.length}/120</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Descrição detalhada *</Text>
              <TextInput
                style={[styles.textArea, descricao.length > 0 && descricao.length < 20 && styles.inputError]}
                placeholder="Descreva com detalhes o ocorrido (mín. 20 caracteres)..."
                placeholderTextColor={C.textMuted}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={2000}
              />
              <Text style={styles.charCount}>{descricao.length}/2000</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Urgência</Text>
              <View style={styles.urgRow}>
                {URGENCIAS.map((u) => (
                  <Pressable
                    key={u.id}
                    style={[
                      styles.urgBtn,
                      urgencia === u.id && { borderColor: u.color, backgroundColor: u.color + "15" },
                    ]}
                    onPress={() => { Haptics.selectionAsync(); setUrgencia(u.id); }}
                  >
                    <Text style={[styles.urgBtnText, urgencia === u.id && { color: u.color, fontFamily: "Inter_600SemiBold" }]}>{u.label}</Text>
                    <Text style={styles.urgBtnDesc}>{u.desc}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Identificação</Text>

            <View style={[styles.reviewCard, { backgroundColor: C.surfaceSecondary }]}>
              <Text style={styles.reviewTitle}>Resumo da manifestação</Text>
              {tipoSelecionado && (
                <View style={[styles.tipoSelectedBanner, { backgroundColor: tipoSelecionado.bg, marginBottom: 0 }]}>
                  <Ionicons name={tipoSelecionado.icon} size={14} color={tipoSelecionado.color} />
                  <Text style={[styles.tipoSelectedText, { color: tipoSelecionado.color, fontSize: 12 }]}>{tipoSelecionado.label} · {categoria}</Text>
                </View>
              )}
              <Text style={styles.reviewTituloText}>{titulo}</Text>
            </View>

            <View style={styles.anonRow}>
              <Pressable
                style={styles.anonToggle}
                onPress={() => { Haptics.selectionAsync(); setAnonimo(!anonimo); }}
              >
                <View style={[styles.checkbox, anonimo && styles.checkboxChecked]}>
                  {anonimo && <Ionicons name="checkmark" size={13} color="#fff" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.anonLabel}>Manifestação anônima</Text>
                  <Text style={styles.anonDesc}>Seus dados não serão vinculados ao protocolo</Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.lgpdBox}>
              <Pressable style={styles.lgpdRow} onPress={() => { Haptics.selectionAsync(); setLgpd(!lgpd); }}>
                <View style={[styles.checkbox, lgpd && styles.checkboxChecked]}>
                  {lgpd && <Ionicons name="checkmark" size={13} color="#fff" />}
                </View>
                <Text style={styles.lgpdText}>
                  Li e aceito a <Text style={styles.lgpdLink}>Política de Privacidade</Text> e os <Text style={styles.lgpdLink}>Termos de Uso</Text> desta plataforma, em conformidade com a <Text style={styles.lgpdLink}>LGPD (Lei 13.709/2018)</Text>.
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom action */}
      <View style={[styles.bottomAction, { paddingBottom: bottomInset + 8 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.nextBtn,
            (!canAdvance1 && step === 1 || !canAdvance2 && step === 2 || !canSubmit && step === 3) && styles.nextBtnDisabled,
            pressed && { opacity: 0.9 },
          ]}
          disabled={(step === 1 && !canAdvance1) || (step === 2 && !canAdvance2) || (step === 3 && !canSubmit) || isLoading}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>
            {step === 3 ? (isLoading ? "Enviando..." : "Enviar manifestação") : "Continuar"}
          </Text>
          {step < 3 && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          {step === 3 && <Ionicons name="send" size={16} color="#fff" />}
        </Pressable>
      </View>
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
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: C.text },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary },
  progressBar: {
    height: 3,
    backgroundColor: C.border,
    width: "100%",
  },
  progressFill: {
    height: 3,
    backgroundColor: C.primary,
    borderRadius: 2,
  },
  form: { padding: 20 },
  stepContent: { gap: 20 },
  stepTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: C.text },
  stepDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: -12 },
  tiposGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tipoCard: {
    width: "47%",
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    alignItems: "flex-start",
    borderWidth: 1.5,
    borderColor: C.border,
  },
  tipoIcon: { width: 46, height: 46, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  tipoLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text },
  tipoDesc: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 14 },
  categoriasGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  catBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  catBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.textSecondary },
  catBtnTextActive: { color: "#fff" },
  tipoSelectedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 4,
  },
  tipoSelectedText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  field: { gap: 6 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: C.text },
  textInput: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: C.text,
  },
  textArea: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: C.text,
    minHeight: 130,
  },
  inputError: { borderColor: C.error },
  charCount: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textMuted, alignSelf: "flex-end" },
  urgRow: { flexDirection: "row", gap: 8 },
  urgBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: "center",
    gap: 3,
  },
  urgBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.text },
  urgBtnDesc: { fontSize: 10, fontFamily: "Inter_400Regular", color: C.textSecondary },
  reviewCard: {
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  reviewTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: C.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  reviewTituloText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text, lineHeight: 20 },
  anonRow: { gap: 8 },
  anonToggle: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: C.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  anonLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: C.text },
  anonDesc: { fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, marginTop: 2 },
  lgpdBox: {
    backgroundColor: C.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
  },
  lgpdRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: C.primary, borderColor: C.primary },
  lgpdText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 18 },
  lgpdLink: { color: C.primary, fontFamily: "Inter_500Medium" },
  bottomAction: {
    padding: 16,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  nextBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  // Success
  successContainer: { justifyContent: "space-between" },
  successInner: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: C.successBg,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold", color: C.text, textAlign: "center" },
  successDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: C.textSecondary, textAlign: "center", lineHeight: 20 },
  protocoloBox: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    width: "100%",
    borderWidth: 1.5,
    borderColor: C.border,
  },
  protocoloLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: C.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  protocoloNum: { fontSize: 22, fontFamily: "Inter_700Bold", color: C.primary, letterSpacing: 0.5 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: C.surfaceSecondary,
  },
  copyBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.primary },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: C.surfaceSecondary,
    padding: 12,
    borderRadius: 12,
    width: "100%",
  },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: C.textSecondary, lineHeight: 16 },
  successActions: { padding: 20, gap: 10 },
  btnPrimary: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnPrimaryText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnSecondaryText: { fontSize: 15, fontFamily: "Inter_500Medium", color: C.textSecondary },
});

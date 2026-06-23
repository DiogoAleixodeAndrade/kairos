import { KairosAIInsightCard } from "@/components/cards/KairosAIInsightCard";
import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View } from "react-native";

export default function AIScreen() {
  return (
    <KairosScreen>
      <KairosHeader title="Kairos AI" subtitle="Seu guia pessoal de performance." />

      <View style={{ marginTop: 28 }}>
        <KairosAIInsightCard
          title="Eu sou a Kairos AI"
          message="Eu analiso sua alimentação, treino, sono, água e progresso para entregar decisões simples e inteligentes todos os dias."
        />
      </View>

      <View style={{ marginTop: 14 }}>
        <KairosAIInsightCard
          title="Insight de hoje"
          message="Sua proteína ficou abaixo da meta nos últimos 3 dias. A melhor ação hoje é adicionar uma fonte proteica no café da manhã."
        />
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Pergunte para a IA
      </KairosText>

      <KairosInput
        style={{ marginTop: 12, borderRadius: 999 }}
        placeholder="Ex: Por que meu peso travou?"
      />
    </KairosScreen>
  );
}
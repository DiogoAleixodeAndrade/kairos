import { KairosAIInsightCard } from "@/components/cards/KairosAIInsightCard";
import { KairosMacroCard } from "@/components/cards/KairosMacroCard";
import { KairosScoreCard } from "@/components/cards/KairosScoreCard";
import { KairosStatCard } from "@/components/cards/KairosStatCard";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosQuickAction } from "@/components/ui/KairosQuickAction";
import { KairosText } from "@/components/ui/KairosText";
import { dashboardMock } from "@/features/dashboard/dashboard.mock";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { Brain, Camera, Droplets, Moon, Plus, Scale, Utensils } from "lucide-react-native";
import { View } from "react-native";

export default function HomeScreen() {
  const data = dashboardMock;

  const caloriesPercentage = Math.round((data.calories.current / data.calories.target) * 100);
  const waterLiters = data.water.currentMl / 1000;
  const waterTargetLiters = data.water.targetMl / 1000;

  const lostWeight = data.weight.startKg - data.weight.currentKg;
  const totalGoal = data.weight.startKg - data.weight.targetKg;
  const weightProgress = Math.round((lostWeight / totalGoal) * 100);

  return (
    <KairosScreen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <KairosLogo />

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.borderGold,
            paddingVertical: 8,
            paddingHorizontal: 14,
          }}
        >
          <KairosText variant="body" color={colors.gold} style={{ fontSize: 13, fontWeight: "900" }}>
            {data.user.streakDays} dias
          </KairosText>
        </View>
      </View>

      <KairosText variant="subtitle" style={{ marginTop: 32 }}>
        Bom dia,
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 4 }}>
        {data.user.name} ✦
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 6 }}>
        Hoje é o momento certo para evoluir.
      </KairosText>

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.gold}>
              Calorias de hoje
            </KairosText>

            <KairosText variant="metric" style={{ marginTop: 18 }}>
              {data.calories.current}
            </KairosText>

            <KairosText variant="subtitle">
              de {data.calories.target} kcal
            </KairosText>
          </View>

          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              borderWidth: 8,
              borderColor: "rgba(214,168,79,0.22)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <KairosText variant="body" color={colors.gold} style={{ fontSize: 22, fontWeight: "900" }}>
              {caloriesPercentage}%
            </KairosText>
          </View>
        </View>

        <KairosProgressBar
          value={data.calories.current}
          max={data.calories.target}
          color={colors.gold}
          style={{ marginTop: 18 }}
        />
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.white}>
          Macros
        </KairosText>

        <View style={{ gap: 18, marginTop: 18 }}>
          <KairosMacroCard
            label="Proteína"
            current={data.macros.protein.current}
            target={data.macros.protein.target}
            unit="g"
            color={colors.gold}
          />

          <KairosMacroCard
            label="Carboidratos"
            current={data.macros.carbs.current}
            target={data.macros.carbs.target}
            unit="g"
            color={colors.blue}
          />

          <KairosMacroCard
            label="Gorduras"
            current={data.macros.fat.current}
            target={data.macros.fat.target}
            unit="g"
            color={colors.purple}
          />
        </View>
      </KairosCard>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosStatCard
          label="Água"
          value={`${waterLiters.toFixed(1)}L`}
          description={`meta ${waterTargetLiters.toFixed(1)}L`}
          accent="blue"
          style={{ flex: 1 }}
        />

        <KairosStatCard
          label="Sono"
          value={data.sleep.duration}
          description={`qualidade ${data.sleep.quality}/10`}
          accent="purple"
          style={{ flex: 1 }}
        />
      </View>

      <KairosCard variant="purple" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.purple}>
          Treino de hoje
        </KairosText>

        <KairosText variant="body" style={{ fontSize: 26, fontWeight: "900", marginTop: 12 }}>
          {data.training.title}
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 4 }}>
          {data.training.subtitle}
        </KairosText>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <KairosText variant="subtitle">Duração</KairosText>
            <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
              {data.training.durationMinutes} min
            </KairosText>
          </View>

          <View style={{ flex: 1 }}>
            <KairosText variant="subtitle">Estimativa</KairosText>
            <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
              {data.training.estimatedCalories} kcal
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <KairosCard variant="gold" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.gold}>
          Jornada de peso
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 12 }}>
          -{lostWeight.toFixed(1)} kg
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 4 }}>
          De {data.weight.startKg} kg para {data.weight.currentKg} kg. Meta: {data.weight.targetKg} kg.
        </KairosText>

        <KairosProgressBar value={weightProgress} max={100} color={colors.gold} style={{ marginTop: 16 }} />

        <KairosText variant="body" color={colors.gold} style={{ marginTop: 8 }}>
          {weightProgress}% do caminho concluído
        </KairosText>
      </KairosCard>

      <View style={{ marginTop: 14 }}>
        <KairosScoreCard score={data.score} />
      </View>

      <View style={{ marginTop: 14 }}>
        <KairosAIInsightCard message={data.ai.message} />
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Ações rápidas
      </KairosText>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
        <KairosQuickAction
          title="Refeição"
          subtitle="Registrar agora"
          icon={<Utensils color={colors.gold} size={24} />}
          onPress={() => router.push("/(tabs)/food")}
        />

        <KairosQuickAction
          title="Água"
          subtitle="Adicionar copo"
          icon={<Droplets color={colors.blue} size={24} />}
          onPress={() => router.push("/(tabs)/food")}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <KairosQuickAction
          title="Peso"
          subtitle="Atualizar hoje"
          icon={<Scale color={colors.purple} size={24} />}
          onPress={() => router.push("/(tabs)/progress")}
        />

        <KairosQuickAction
          title="Foto"
          subtitle="Evolução"
          icon={<Camera color={colors.gold} size={24} />}
          onPress={() => router.push("/(tabs)/progress")}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <KairosQuickAction
          title="Sono"
          subtitle="Registrar noite"
          icon={<Moon color={colors.blue} size={24} />}
          onPress={() => router.push("/(tabs)/progress")}
        />

        <KairosQuickAction
          title="IA"
          subtitle="Perguntar"
          icon={<Brain color={colors.purple} size={24} />}
          onPress={() => router.push("/(tabs)/ai")}
        />
      </View>

      <View style={{ height: 12 }} />
    </KairosScreen>
  );
}
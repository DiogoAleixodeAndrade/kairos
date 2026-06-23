import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";

type KairosAIInsightCardProps = {
  title?: string;
  message: string;
};

export function KairosAIInsightCard({
  title = "Kairos AI",
  message,
}: KairosAIInsightCardProps) {
  return (
    <KairosCard variant="purple">
      <KairosText variant="label" color={colors.purple}>
        {title}
      </KairosText>

      <KairosText variant="body" style={{ marginTop: 12 }}>
        {message}
      </KairosText>
    </KairosCard>
  );
}
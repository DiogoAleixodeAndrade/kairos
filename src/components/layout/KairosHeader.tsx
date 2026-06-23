import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import type { ReactNode } from "react";

type KairosHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function KairosHeader({ title, subtitle, right }: KairosHeaderProps) {
  return (
    <>
      <KairosLogo />

      {right}

      <KairosText variant="title" style={{ marginTop: 32 }}>
        {title}
      </KairosText>

      {subtitle ? (
        <KairosText variant="subtitle" style={{ marginTop: 8 }}>
          {subtitle}
        </KairosText>
      ) : null}
    </>
  );
}
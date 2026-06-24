import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosOptionCard } from "@/components/ui/KairosOptionCard";
import { KairosText } from "@/components/ui/KairosText";
import type { ProgressPhotoType } from "@/features/progress/progress.types";
import { useProgressStore } from "@/stores/progress.store";
import { colors } from "@/styles/theme";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, View } from "react-native";
import { useGamificationStore } from "@/stores/gamification.store";

const photoTypes: { value: ProgressPhotoType; title: string; description: string }[] = [
  {
    value: "front",
    title: "Frente",
    description: "Foto frontal para comparação.",
  },
  {
    value: "side",
    title: "Lado",
    description: "Foto lateral para acompanhar silhueta.",
  },
  {
    value: "back",
    title: "Costas",
    description: "Foto de costas para comparação.",
  },
  {
    value: "free",
    title: "Livre",
    description: "Qualquer foto de evolução.",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function photoTypeLabel(type: ProgressPhotoType) {
  const item = photoTypes.find((photoType) => photoType.value === type);

  return item?.title ?? "Livre";
}

export default function PhotosScreen() {
  const addPhoto = useProgressStore((state) => state.addPhoto);
  const photos = useProgressStore((state) => state.photos);

  const awardAction = useGamificationStore((state) => state.awardAction);

  const [selectedType, setSelectedType] = useState<ProgressPhotoType>("front");

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita acesso às fotos para registrar sua evolução.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [3, 4],
    });

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0]?.uri;

    if (!uri) {
      Alert.alert("Erro", "Não foi possível carregar a foto.");
      return;
    }

    awardAction("photo_logged");

    addPhoto({
      uri,
      type: selectedType,
    });

    Alert.alert("Foto salva", "Sua foto de evolução foi registrada.");
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.blue}>
        Fotos de evolução
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Registre sua mudança.
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Fotos ajudam a perceber evolução que a balança nem sempre mostra.
      </KairosText>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Tipo da foto
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {photoTypes.map((type) => (
          <KairosOptionCard
            key={type.value}
            title={type.title}
            description={type.description}
            selected={selectedType === type.value}
            onPress={() => setSelectedType(type.value)}
          />
        ))}
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={pickImage}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Camera color={colors.background} size={18} />
          <KairosText variant="body" color={colors.background} style={{ fontWeight: "900" }}>
            Escolher foto
          </KairosText>
        </View>
      </KairosButton>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Galeria
      </KairosText>

      <View style={{ gap: 14, marginTop: 14 }}>
        {photos.length === 0 ? (
          <KairosCard>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              Nenhuma foto registrada ainda.
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              Adicione sua primeira foto para começar seu histórico visual.
            </KairosText>
          </KairosCard>
        ) : (
          photos.map((photo) => (
            <KairosCard key={photo.id} style={{ padding: 12 }}>
              <Image
                source={{ uri: photo.uri }}
                style={{
                  width: "100%",
                  height: 320,
                  borderRadius: 18,
                  backgroundColor: colors.backgroundSoft,
                }}
                resizeMode="cover"
              />

              <View style={{ padding: 8 }}>
                <KairosText variant="body" style={{ fontWeight: "900", marginTop: 8 }}>
                  {photoTypeLabel(photo.type)}
                </KairosText>

                <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                  {formatDate(photo.takenAt)}
                </KairosText>
              </View>
            </KairosCard>
          ))
        )}
      </View>
    </KairosScreen>
  );
}
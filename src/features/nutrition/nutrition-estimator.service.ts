type EstimatedFood = {
  foodName: string;
  quantityG: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

const FOOD_DATABASE = [
  {
    keywords: ["pão", "pao", "francês", "frances"],
    foodName: "Pão francês",
    quantityG: 50,
    caloriesKcal: 140,
    proteinG: 4.5,
    carbsG: 28,
    fatG: 1.5,
  },
  {
    keywords: ["ovo", "ovos"],
    foodName: "Ovo",
    quantityG: 50,
    caloriesKcal: 75,
    proteinG: 6.5,
    carbsG: 0.5,
    fatG: 5,
  },
  {
    keywords: ["queijo", "muçarela", "mussarela"],
    foodName: "Queijo muçarela",
    quantityG: 30,
    caloriesKcal: 95,
    proteinG: 7,
    carbsG: 1,
    fatG: 7,
  },
  {
    keywords: ["presunto"],
    foodName: "Presunto",
    quantityG: 30,
    caloriesKcal: 45,
    proteinG: 6,
    carbsG: 1,
    fatG: 2,
  },
  {
    keywords: ["arroz"],
    foodName: "Arroz cozido",
    quantityG: 100,
    caloriesKcal: 130,
    proteinG: 2.5,
    carbsG: 28,
    fatG: 0.3,
  },
  {
    keywords: ["feijão", "feijao"],
    foodName: "Feijão cozido",
    quantityG: 100,
    caloriesKcal: 90,
    proteinG: 6,
    carbsG: 16,
    fatG: 0.5,
  },
  {
    keywords: ["frango"],
    foodName: "Frango grelhado",
    quantityG: 100,
    caloriesKcal: 165,
    proteinG: 31,
    carbsG: 0,
    fatG: 3.5,
  },
  {
    keywords: ["carne", "patinho"],
    foodName: "Carne magra",
    quantityG: 100,
    caloriesKcal: 220,
    proteinG: 28,
    carbsG: 0,
    fatG: 12,
  },
  {
    keywords: ["banana"],
    foodName: "Banana",
    quantityG: 90,
    caloriesKcal: 80,
    proteinG: 1,
    carbsG: 20,
    fatG: 0.2,
  },
  {
    keywords: ["whey"],
    foodName: "Whey protein",
    quantityG: 30,
    caloriesKcal: 120,
    proteinG: 24,
    carbsG: 3,
    fatG: 2,
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function detectQuantity(text: string, keyword: string) {
  const normalized = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword);

  const patterns = [
    new RegExp(`(\\d+)\\s+${normalizedKeyword}`, "i"),
    new RegExp(`(\\d+)\\s*unidades?\\s+de\\s+${normalizedKeyword}`, "i"),
    new RegExp(`(\\d+)\\s*fatias?\\s+de\\s+${normalizedKeyword}`, "i"),
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return normalized.includes(normalizedKeyword) ? 1 : 0;
}

export function estimateMealFromText(description: string): EstimatedFood {
  const normalizedDescription = normalizeText(description);

  const estimatedItems = FOOD_DATABASE.flatMap((food) => {
    const matchedKeyword = food.keywords.find((keyword) => {
      return normalizedDescription.includes(normalizeText(keyword));
    });

    if (!matchedKeyword) {
      return [];
    }

    const quantity = detectQuantity(description, matchedKeyword) || 1;

    return [
      {
        foodName: food.foodName,
        quantityG: food.quantityG * quantity,
        caloriesKcal: food.caloriesKcal * quantity,
        proteinG: food.proteinG * quantity,
        carbsG: food.carbsG * quantity,
        fatG: food.fatG * quantity,
      },
    ];
  });

  if (estimatedItems.length === 0) {
    return {
      foodName: description,
      quantityG: 250,
      caloriesKcal: 500,
      proteinG: 25,
      carbsG: 50,
      fatG: 15,
    };
  }

  return estimatedItems.reduce<EstimatedFood>(
    (total, item) => {
      return {
        foodName:
          total.foodName.length > 0
            ? `${total.foodName}, ${item.foodName}`
            : item.foodName,
        quantityG: total.quantityG + item.quantityG,
        caloriesKcal: total.caloriesKcal + item.caloriesKcal,
        proteinG: total.proteinG + item.proteinG,
        carbsG: total.carbsG + item.carbsG,
        fatG: total.fatG + item.fatG,
      };
    },
    {
      foodName: "",
      quantityG: 0,
      caloriesKcal: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
    }
  );
}
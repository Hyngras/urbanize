import { DemandCategory } from "@/types/demand";

interface ClassificationResult {
  categoria: DemandCategory;
  score: number;
  labels: string[];
}

// Mapeamento de labels do MobileNet para categorias do sistema
const LABEL_MAP: { keywords: string[]; categoria: DemandCategory }[] = [
  {
    keywords: [
      "pothole", "sinkhole", "hole", "road", "asphalt", "pavement", "street", "highway",
      "sidewalk", "curb", "cobblestone", "alley", "crack", "damaged road",
    ],
    categoria: "vias_publicas",
  },
  {
    keywords: [
      "street light", "lamp", "lantern", "lamppost", "utility pole", "telephone pole",
      "electric pole", "power line", "power cable", "electrical wire", "wire", "cable",
      "fallen wire", "fallen pole", "torch", "spotlight", "neon", "candle",
    ],
    categoria: "iluminacao_publica",
  },
  {
    keywords: [
      "garbage", "trash", "waste", "litter", "dump", "rubbish",
      "dumpster", "recycling", "compost", "debris", "pile of trash",
    ],
    categoria: "coleta_de_lixo",
  },
  {
    keywords: [
      "flood", "sewage", "pipe", "drain", "gutter", "water",
      "puddle", "manhole", "plumbing",
    ],
    categoria: "saneamento",
  },
  {
    keywords: [
      "graffiti", "vandalism", "broken", "shattered", "damaged",
      "wall", "spray paint",
    ],
    categoria: "fiscalizacao",
  },
  {
    keywords: [
      "park", "tree", "vegetation", "garden", "grass", "bush",
      "weed", "overgrown", "jungle", "forest",
    ],
    categoria: "zeladoria",
  },
];

const classify = (predictions: { className: string; probability: number }[]): ClassificationResult => {
  const labels = predictions.map((p) => p.className.toLowerCase());

  for (const entry of LABEL_MAP) {
    for (let i = 0; i < predictions.length; i++) {
      const label = predictions[i].className.toLowerCase();
      const matched = entry.keywords.some((kw) => label.includes(kw));
      if (matched) {
        // Score baseado na confiança do MobileNet + posição no ranking
        const score = Math.min(predictions[i].probability + (3 - i) * 0.05, 0.98);
        return { categoria: entry.categoria, score: parseFloat(score.toFixed(2)), labels };
      }
    }
  }

  return { categoria: "outros", score: 0.45, labels };
};

let modelCache: import("@tensorflow-models/mobilenet").MobileNet | null = null;

export const classifyImage = async (imageElement: HTMLImageElement | HTMLCanvasElement): Promise<ClassificationResult> => {
  // Carrega o modelo uma vez e mantém em memória
  if (!modelCache) {
    const mobilenet = await import("@tensorflow-models/mobilenet");
    await import("@tensorflow/tfjs");
    modelCache = await mobilenet.load({ version: 2, alpha: 1.0 });
  }

  const predictions = await modelCache.classify(imageElement, 5);
  return classify(predictions);
};

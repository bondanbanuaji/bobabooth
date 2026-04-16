export interface PhotoboothTemplate {
  id: string;
  name: string;
  layout: "grid-2x2" | "strip-4" | "polaroid";
  bgColor: string;
  fontFam?: string;
  textColor?: string;
  frameId?: string; // e.g., URL or identifier for an overlay SVG
}

export const defaultTemplates: PhotoboothTemplate[] = [
  {
    id: "korean-clean",
    name: "Korean Minimal",
    layout: "strip-4",
    bgColor: "#ffffff",
    textColor: "#a1a1aa", // zinc-400
  },
  {
    id: "dark-aesthetic",
    name: "Midnight Vibes",
    layout: "strip-4",
    bgColor: "#18181b", // zinc-900
    textColor: "#d4d4d8",
  },
  {
    id: "classic-polaroid",
    name: "Classic Polaroid",
    layout: "polaroid",
    bgColor: "#f8fafc",
    textColor: "#1e293b",
  },
  {
    id: "party-grid",
    name: "Party Grid",
    layout: "grid-2x2",
    bgColor: "#fce7f3", // pink-100
    textColor: "#db2777",
  }
];

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
    id: "classic-boba",
    name: "Classic Beige",
    layout: "strip-4",
    bgColor: "#eae3d8", // Light beige
    textColor: "#5a4031", // Deep brown text
    fontFam: "Fredoka, sans-serif"
  },
  {
    id: "dark-roast",
    name: "Dark Roast",
    layout: "strip-4",
    bgColor: "#292524", // Stone 800
    textColor: "#c29a77", // Caramel text
    fontFam: "Outfit, sans-serif"
  },
  {
    id: "classic-polaroid",
    name: "Classic Polaroid",
    layout: "polaroid",
    bgColor: "#faf8f5", // Warm milk cream
    textColor: "#2c2522", // Espresso black
    fontFam: "Fredoka, sans-serif"
  },
  {
    id: "party-grid",
    name: "Matcha Grid",
    layout: "grid-2x2",
    bgColor: "#718355", // Matcha green (unisex)
    textColor: "#ffffff", // White text
    fontFam: "Outfit, sans-serif"
  }
];

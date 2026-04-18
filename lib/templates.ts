export interface PhotoboothTemplate {
  id: string;
  name: string;
  layout: string;
  frameSrc: string; // The PNG overlay
  bgColor: string;
  boxes: { x: number; y: number; w: number; h: number }[];
}

// Helper to generate typical 2-column grid boxes
// Fills the LEFT column first, then the RIGHT column.
function generateGridBoxes(rows: number, leftX: number, rightX: number, topY: number, yGap: number, w: number, h: number) {
  const boxes = [];
  // Left column
  for (let i = 0; i < rows; i++) {
    boxes.push({ x: leftX, y: topY + i * yGap, w, h });
  }
  // Right column
  for (let i = 0; i < rows; i++) {
    boxes.push({ x: rightX, y: topY + i * yGap, w, h });
  }
  return boxes;
}

export const defaultTemplates: PhotoboothTemplate[] = [
  {
    id: "boothlab-1",
    name: "Boothlab Style 1",
    layout: "strip-6",
    frameSrc: "/img/template/Free Frame Boothlab 1.png",
    bgColor: "#ffffff",
    boxes: generateGridBoxes(3, 50, 650, 360, 440, 500, 410)
  },
  {
    id: "boothlab-2",
    name: "Boothlab Style 2",
    layout: "strip-8",
    frameSrc: "/img/template/Free Frame Boothlab 2.png",
    bgColor: "#ffffff",
    boxes: generateGridBoxes(4, 60, 660, 50, 420, 480, 400)
  },
  {
    id: "boothlab-3",
    name: "Boothlab Style 3",
    layout: "strip-6",
    frameSrc: "/img/template/Free Frame Boothlab 3.png",
    bgColor: "#ffffff",
    boxes: generateGridBoxes(3, 90, 690, 95, 495, 420, 450)
  },
  {
    id: "boothlab-4",
    name: "Boothlab Style 4",
    layout: "strip-8",
    frameSrc: "/img/template/Free Frame Boothlab 4.png",
    bgColor: "#ffffff",
    boxes: generateGridBoxes(4, 40, 640, 80, 430, 520, 390)
  },
  {
    id: "boothlab-5",
    name: "Boothlab Style 5",
    layout: "strip-6",
    frameSrc: "/img/template/Free Frame Boothlab 5.png",
    bgColor: "#ffffff",
    boxes: generateGridBoxes(3, 70, 660, 60, 510, 480, 490)
  }
];


import { Template } from "@/types";

export const defaultTemplates: Template[] = [
  {
    id: "template-1",
    name: "Simple Gradient",
    thumbnail: "/templates/simple-gradient-thumb.jpg",
    background: "bg-gradient-to-br from-gradient-start to-gradient-end",
    textPosition: "center",
    textAlignment: "center",
    textColor: "text-white",
    font: "font-sans"
  },
  {
    id: "template-2",
    name: "Clean White",
    thumbnail: "/templates/clean-white-thumb.jpg",
    background: "bg-white",
    textPosition: "center",
    textAlignment: "center",
    textColor: "text-gray-900",
    font: "font-serif"
  },
  {
    id: "template-3",
    name: "Dark Minimal",
    thumbnail: "/templates/dark-minimal-thumb.jpg",
    background: "bg-gray-900",
    textPosition: "bottom",
    textAlignment: "left",
    textColor: "text-white",
    font: "font-mono"
  },
];

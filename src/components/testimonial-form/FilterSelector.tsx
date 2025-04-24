
import React from "react";
import { cn } from "@/lib/utils";

interface Filter {
  id: string;
  name: string;
  className: string;
}

interface FilterSelectorProps {
  activeFilter: string;
  onChange: (filterId: string) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ activeFilter, onChange }) => {
  const filters: Filter[] = [
    { id: "normal", name: "Normal", className: "" },
    { id: "grayscale", name: "B&W", className: "grayscale" },
    { id: "sepia", name: "Retro", className: "sepia" },
    { id: "invert", name: "Invert", className: "invert" },
    { id: "saturate", name: "Vibrant", className: "saturate-150" },
  ];
  
  return (
    <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <div 
          key={filter.id}
          className={cn(
            "flex flex-col items-center cursor-pointer transition-transform",
            activeFilter === filter.id ? "scale-110" : "",
          )}
          onClick={() => onChange(filter.id)}
        >
          <div 
            className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br from-brand-300 to-purple-500 mb-1",
              filter.className,
              activeFilter === filter.id ? "ring-2 ring-white" : ""
            )}
          />
          <span className="text-xs font-medium">
            {filter.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FilterSelector;

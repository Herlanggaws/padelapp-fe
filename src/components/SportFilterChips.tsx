import type { SportScope } from "@/types/sport";

export type SportFilterOption = SportScope | "all";

export interface SportFilterChipsProps {
  options: SportFilterOption[];
  selected: SportFilterOption;
  onChange: (selected: SportFilterOption) => void;
  className?: string;
}

const OPTION_LABELS: Record<SportFilterOption, string> = {
  all: "All",
  padel: "Padel",
  tennis: "Tennis",
  both: "Both",
};

export default function SportFilterChips({
  options,
  selected,
  onChange,
  className = "",
}: SportFilterChipsProps) {
  return (
    <div
      role="group"
      aria-label="Sport filter"
      className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      {options.map((option) => {
        const isSelected = selected === option;
        const label = OPTION_LABELS[option] ?? option;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#9FE870] focus-visible:ring-offset-2 ${
              isSelected
                ? "bg-[#18181B] text-[#9FE870] shadow-sm"
                : "bg-white text-[#5D5F5F] border border-[#F4F4F5] hover:border-[#E4E4E7] hover:text-[#151C27]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

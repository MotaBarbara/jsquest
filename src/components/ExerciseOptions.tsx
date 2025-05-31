import { ExerciseOptionsProps } from "../types/props";

export default function ExerciseOptions({
  options,
  onOptionSelect,
}: ExerciseOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-12 max-w-400">
      {options.map((option, index) => (
        <div key={option} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="option"
            value={option}
            id={`option-${index}`}
            className="hidden peer"
            onChange={e => onOptionSelect(index, e.target.checked)}
          />
          <label
            htmlFor={`option-${index}`}
            className="flex justify-center h-full *:flex items-center p-8 border-2 border-[var(--secondary-color)] cursor-pointer peer-checked:bg-[var(--primary-color)] peer-checked:text-[var(--text)] peer-checked:border-[var(--primary-color)] w-full"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
}

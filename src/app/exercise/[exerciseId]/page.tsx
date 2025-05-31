"use client";

import Button from "@/src/components/Button";
import useExercise from "@/src/hooks/useExercise";
import getButtonState from "@/src/utils/getButtonState";
import useRequireAuth from "@/src/hooks/useRequireAuth";
import useExerciseSubmission from "@/src/hooks/useExerciseSubmission";

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-[100vh] flex items-center justify-center">
      <p>{children}</p>
    </main>
  );
}

export default function ExercisePage() {
  const { exercise, level, nextExercise, isLoading, error } = useExercise();
  const { loading } = useRequireAuth();

  const { isCorrect, selectedOptions, handleOptionSelect, handleSubmit } =
    useExerciseSubmission(exercise);

  const { text, link, variant, type } = getButtonState(
    isCorrect,
    selectedOptions,
    nextExercise ? { id: nextExercise.id } : undefined,
  );

  if (isLoading) return <MainContent>Loading...</MainContent>;
  if (error) return <MainContent>{error}</MainContent>;
  if (!exercise) return <MainContent>No exercises found</MainContent>;

  if (loading) return <main className="flex items-center">Loading...</main>;

  return (
    <main className="h-[100vh] min-h-[700px] flex items-center justify-center">
      <div className="text-center">
        <p>
          Level <span>{exercise.level_id}</span> - <span>{level?.title}</span>
        </p>
        <h2>{exercise.instruction}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mt-12 max-w-400">
            {exercise.options.map((option, index) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="option"
                  value={option}
                  id={`option-${index}`}
                  className="hidden peer"
                  onChange={e => handleOptionSelect(index, e.target.checked)}
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
          <div className="col-span-2 items-center m-6">
            <Button type={type} variant={variant} href={link}>
              {text}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { ExerciseProps, LevelProps } from "../types/props";
import { useParams } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function useExercise() {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState<ExerciseProps | null>(null);
  const [level, setLevel] = useState<LevelProps | null>(null);
  const [nextExercise, setNextExercise] = useState<ExerciseProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercise() {
      if (!exerciseId) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data: exerciseData, error: exerciseError } = await supabase
          .from("exercises")
          .select("*")
          .eq("id", exerciseId)
          .single();

        if (exerciseError || !exerciseData)
          throw new Error("Exercise not found");

        setExercise(exerciseData);

        const { data: nextExerciseData, error: nextExerciseError } =
          await supabase
            .from("exercises")
            .select("*")
            .eq("level_id", exerciseData.level_id)
            .gt('"order"', exerciseData.order)
            .order('"order"', { ascending: true })
            .limit(1);

        if (nextExerciseError)
          throw new Error("Could not fetch the next exercise");
        if (nextExerciseData && nextExerciseData.length > 0) {
          setNextExercise(nextExerciseData[0]);
        }

        const { data: levelData, error: levelError } = await supabase
          .from("levels")
          .select("*")
          .eq("id", exerciseData.level_id)
          .single();

        if (levelError) throw new Error("Could not fetch the level data");
        if (levelData) {
          setLevel(levelData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchExercise();
  }, [exerciseId]);

  return {
    exerciseId,
    exercise,
    level,
    nextExercise,
    isLoading,
    error,
  };
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { LevelsProps } from "../types/props";

export default function useLevels() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [levels, setLevels] = useState<LevelsProps[] | null>(null);

  useEffect(() => {
    async function fetchLevels() {
      const { data, error } = await supabase.from("levels").select();

      if (error) {
        setFetchError("Could not fetch the levels");
        return;
      }
      if (!data || data.length === 0) {
        setFetchError("No levels found");
        return;
      }
      setLevels(data);

      const { data: exercisesData, error: exercisesError } = await supabase
        .from("exercises")
        .select("*")
        .order("order", { ascending: true });

      if (exercisesError || !exercisesData) {
        setFetchError("Could not fetch the exercises");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userCompletedExercises, error: userCompletedError } =
        await supabase
          .from("user_exercises")
          .select("exercise_id")
          .eq("user_id", user.id)
          .eq("is_correct", true);

      if (userCompletedError || !userCompletedExercises) {
        setFetchError("Could not fetch completed exercises");
        return;
      }

      const completedIds = userCompletedExercises.map(e => e.exercise_id);
      const uniqueIds = [...new Set(completedIds)].length;

      const inProgressLevel = Math.floor(uniqueIds / 10);
      const exercisesDonePerLevel = uniqueIds - 10 * inProgressLevel;

      const percentageDone = exercisesDonePerLevel * 10;

      const updatedLevels = data.map(level => {
        const isCompleted = level.id <= inProgressLevel - 1;
        const inProgress = level.id === inProgressLevel;

        return {
          ...level,
          isCompleted,
          inProgress,
          percentageDone,
        };
      });

      setLevels(updatedLevels);
    }
    fetchLevels();
  }, []);

  return {
    levels,
    fetchError,
  };
}

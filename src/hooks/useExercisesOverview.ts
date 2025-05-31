"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabaseClient";
import { AllExercisesProps, CurrentLevelProps } from "@/src/types/props";

export default function useExercisesOverview() {
  const { levelId } = useParams();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<AllExercisesProps[] | null>(null);
  const [highestCompletedOrder, setHighestCompletedOrder] = useState<number>(0);
  const [levels, setLevels] = useState<CurrentLevelProps[] | null>(null);

  useEffect(() => {
    async function fetchExercisesAndProgress() {
      const {
        data: exercisesFromCurrentLevel,
        error: exercisesFromCurrentLevelError,
      } = await supabase
        .from("exercises")
        .select("*")
        .eq("level_id", levelId)
        .order("order", { ascending: true });

      if (exercisesFromCurrentLevelError || !exercisesFromCurrentLevel) {
        setFetchError("Could not fetch the exercises");
        setExercises(null);
        return;
      }

      setExercises(exercisesFromCurrentLevel);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: userCompletedExercises, error: userError } = await supabase
        .from("user_exercises")
        .select("exercise_id")
        .eq("user_id", user.id)
        .eq("is_correct", true);

      if (userError || !userCompletedExercises) {
        setFetchError("Could not fetch completed exercises");
        return;
      }

      const completedIds = userCompletedExercises.map(e => e.exercise_id);
      const completed = exercisesFromCurrentLevel.filter(ex =>
        completedIds.includes(ex.id),
      );

      const maxOrder = completed.reduce(
        (max, ex) => (ex.order > max ? ex.order : max),
        0,
      );

      setHighestCompletedOrder(maxOrder);
    }

    async function fetchLevelDetails() {
      const { data, error } = await supabase
        .from("levels")
        .select("title")
        .eq("id", levelId);

      if (error || !data || data.length === 0) {
        setFetchError("Could not fetch the level title");
        return;
      }

      setLevels(data);
    }

    if (levelId) {
      fetchExercisesAndProgress();
      fetchLevelDetails();
    }
  }, [levelId]);

  const currentLevelTitle = levels?.[0]?.title;

  return {
    exercises,
    highestCompletedOrder,
    fetchError,
    currentLevelTitle,
    levelId,
  };
}

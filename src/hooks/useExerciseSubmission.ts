import { useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

export default function useExerciseSubmission(exercise: any) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionSelect = (index: number, checked: boolean) => {
    setIsCorrect(null);
    setSelectedOptions(prev =>
      checked ? [...prev, index] : prev.filter(i => i !== index),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!exercise) return;

    const isAnswerCorrect =
      JSON.stringify(selectedOptions.sort()) ===
      JSON.stringify(exercise.correct_answers.sort());

    setIsCorrect(isAnswerCorrect);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("user_exercises").insert([
        {
          user_id: user.id,
          exercise_id: exercise.id,
          is_correct: isAnswerCorrect,
          level: exercise.level_id,
          exercise_order: exercise.order,
        },
      ]);
    }
  };

  return {
    isCorrect,
    selectedOptions,
    handleOptionSelect,
    handleSubmit,
  };
}

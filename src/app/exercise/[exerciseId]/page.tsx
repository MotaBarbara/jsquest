"use client";
import { supabase } from "@/src/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormEvent } from "react";
import Button from "@/src/components/button";

interface Exercise {
  id: string;
  level_id: number;
  title: string;
  instruction: string;
  options: string[];
  correct_answers: number[];
  order: number;
}
interface Level {
  title: string;
}

export default function ExercisesOverview() {
  const { exerciseId } = useParams();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [nextExercise, setNextExercise] = useState<Exercise | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    async function fetchExercise() {
      if (!exerciseId) return;

      setIsLoading(true);

      const { data: exerciseData, error: exerciseError } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", exerciseId)
        .single();

      if (exerciseError) {
        setFetchError("Could not fetch the exercises");
        setIsLoading(false);
        return;
      }
      if (exerciseData) {
        // Get next exercise
        setExercise(exerciseData);

        const { data: nextExerciseData, error: nextExerciseError } =
          await supabase
            .from("exercises")
            .select("*")
            .eq("level_id", exerciseData.level_id)
            .gt('"order"', exerciseData.order)
            .order('"order"', { ascending: true })
            .limit(1);

        console.log(nextExerciseData);

        if (nextExerciseError) {
          setFetchError("Could not fetch the next exercise");
        }
        if (nextExerciseData && nextExerciseData.length > 0) {
          setNextExercise(nextExerciseData[0]);
        }

        // Get the current level
        const { data: levelData, error: levelError } = await supabase
          .from("levels")
          .select("*")
          .eq("id", exerciseData.level_id)
          .single();

        if (levelError) {
          setFetchError("Could not fetch the level data");
        }
        if (levelData) {
          setLevel(levelData);
        }
      }
      setIsLoading(false);
    }
    fetchExercise();
  }, [exerciseId]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const selectedPositions: number[] = [];
    const checkboxes = e.currentTarget.querySelectorAll(
      'input[type="checkbox"]',
    );
    checkboxes.forEach((checkbox, index) => {
      if ((checkbox as HTMLInputElement).checked) {
        selectedPositions.push(index);
      }
    });
    console.log(selectedPositions, exercise?.correct_answers);

    const isAnswerCorrect =
      JSON.stringify(selectedPositions) ===
      JSON.stringify(exercise?.correct_answers);
    setIsCorrect(isAnswerCorrect);

    const user = await supabase.auth.getUser();
    if (user.data.user) {
      await supabase.from("user_exercises").insert([
        {
          user_id: user.data.user.id,
          exercise_id: exercise?.id,
          is_correct: isAnswerCorrect,
          level: exercise?.level_id,
          exercise_order: exercise?.order,
        },
      ]);
    }
  }

  console.log(level);

  // save the selected value, clear previous answer
  function optionSelected(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const checked = e.target.checked;
    setIsCorrect(null);
    setSelectedOptions(prev => {
      if (checked) {
        return [...prev, index];
      } else {
        return prev.filter(i => i !== index);
      }
    });
  }

  if (isLoading) {
    return (
      <main className="h-[100vh] flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }
  if (fetchError) {
    return <p>{fetchError}</p>;
  }
  if (!exercise) {
    return (
      <main className="h-[100vh] flex items-center justify-center">
        <p>No exercises found</p>
      </main>
    );
  }

  let buttonText: string;
  let buttonLink: string | undefined;
  let buttonVariant: "primary" | "secondary" | "danger";

  if (isCorrect === false) {
    // wrong
    buttonText = "Wrong Answer, try again";
    buttonLink = undefined;
    buttonVariant = "danger";
  } else if (isCorrect === true) {
    // correct
    buttonVariant = "primary";
    if (nextExercise) {
      // with next exercise
      buttonText = "Well Done! Next Exercise";
      buttonLink = `/exercise/${nextExercise.id}`;
    } else {
      // no next exercise
      buttonText = "Well Done! Next Level";
      buttonLink = "/levels";
    }
  } else if (selectedOptions.length > 0) {
    buttonText = "Submit Options";
    buttonLink = undefined;
    buttonVariant = "primary";
  } else {
    // default
    buttonText = "Submit Options";
    buttonLink = undefined;
    buttonVariant = "secondary";
  }

  const buttonType = buttonLink ? undefined : "submit";

  return (
    <main className="h-[100vh] min-h-[700px] flex items-center justify-center">
      {exercise && (
        <div className="text-center">
          {fetchError && <p>{fetchError}</p>}
          {!exercise && <p>No exercise found</p>}
          <p>
            Level <span>{exercise?.level_id}</span> -{" "}
            <span>{level?.title}</span>
          </p>
          <h2>{exercise?.instruction}</h2>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-2 gap-4 mt-12 max-w-400"
          >
            {exercise?.options.map((option, index) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="option"
                  value={option}
                  id={`option-${index}`}
                  className="hidden peer"
                  onChange={e => optionSelected(e, index)}
                ></input>
                <label
                  htmlFor={`option-${index}`}
                  className="flex justify-center h-full *:flex items-center p-8 border-2 border-[var(--secondary-color)] cursor-pointer peer-checked:bg-[var(--primary-color)] peer-checked:text-[var(--text)] peer-checked:border-[var(--primary-color)] w-full"
                >
                  {option}
                </label>
              </div>
            ))}
            <div className="col-span-2 items-center m-6">
              <Button
                type={buttonType}
                variant={buttonVariant}
                href={buttonLink}
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

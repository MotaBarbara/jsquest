import { ButtonStateProps } from "../types/props";

export default function getButtonState(
  isCorrect: boolean | null,
  selectedOptions: number[],
  nextExercise?: { id: string },
): ButtonStateProps {
  if (isCorrect === false) {
    return {
      text: "Wrong Answer, try again",
      variant: "danger",
      type: "submit",
    };
  }

  if (isCorrect === true) {
    return nextExercise
      ? {
          text: "Well Done! Next Exercise",
          link: `/exercise/${nextExercise.id}`,
          variant: "primary",
          type: undefined,
        }
      : {
          text: "Well Done! Next Level",
          link: "/levels",
          variant: "primary",
          type: undefined,
        };
  }

  return {
    text: "Submit Options",
    variant: selectedOptions.length > 0 ? "primary" : "secondary",
    type: "submit",
  };
}

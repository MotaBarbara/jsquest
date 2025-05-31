import { User } from "@supabase/supabase-js";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface FunctionalityCardProps {
  src: StaticImageData;
  altText: string;
  heading: string;
  description: string;
  id: string;
}

export interface ExerciseProps {
  id: string;
  level_id: number;
  title: string;
  instruction: string;
  options: string[];
  correct_answers: number[];
  order: number;
}

export interface LevelProps {
  id: number;
  title: string;
}
export interface AllExercisesProps {
  id: number;
  level_id: number;
  title: string;
  order: number;
}
export interface CurrentLevelProps {
  title: string;
}

export interface LevelsProps {
  id: number;
  title: string;
  isCompleted?: boolean;
  percentageDone?: number;
  inProgress?: number;
}

export interface CircularProgressbarProps {
  percentageDone: number;
}

export interface ButtonProps {
  href?: string;
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "link"
    | "disabled"
    | "danger";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

export interface ExerciseOptionsProps {
  options: string[];
  onOptionSelect: (index: number, checked: boolean) => void;
}
export interface ProcessStepProps {
  src: StaticImageData;
  altText: string;
  heading: string;
  description: string;
}

export interface RankingProps {
  initials: string | null;
  user: string;
  level: string | null;
  score: number | null;
  position: number;
  currentUser?: boolean;
  avatar: string | null;
}

export interface ButtonStateProps {
  text: string;
  link?: string;
  variant: "primary" | "secondary" | "danger";
  type?: "submit" | "button";
}

export interface UserAvatarMenuProps {
  user: User | null;
  profile?: Profile | null;
  avatarUrl?: string | null;
  initials?: string | React.ReactNode;
  openSettings: boolean;
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>;
  signOut: () => void;
}

interface Profile {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface MobileMenuProps {
  user: User | null;
  pathname: string;
  setMobileMenuOpen: (open: boolean) => void;
  signOut: () => void;
}

export interface UserRankingProps {
  id: string;
  first_name: string;
  initials: string | null;
  highestLevel: number | null;
  score: number;
};

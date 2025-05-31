"use client";
import Link from "next/link";
import { ButtonProps } from "../types/props";

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "px-8 py-3 transition-colors duration-200 inline-block text-center cursor-pointer w-full max-w-300 whitespace-nowrap";

  const variants = {
    primary: "bg-[var(--primary-color)] text-white hover:bg-[#60469C]",
    secondary: "bg-[var(--secondary-color)] text-white hover:bg-[#71648F]",
    tertiary:
      "bg-[var(--background-color)] text-[var(--text)] hover:bg-[var(--secondary-background)]]",
    link: "px-0! py-0! text-[var(--text)] items-center",
    disabled:
      "bg-gray-500 text-gray-300 cursor-not-allowed pointer-events-none",
    danger:
      "bg-[var(--danger)] text-white hover:bg-purple-500 pointer-events-none",
  };
  const styles = `${base} ${variants[variant]} ${className}`;

  if (type === "submit") {
    return (
      <button
        type="submit"
        className={styles}
        disabled={disabled || variant === "disabled"}
        {...props}
      >
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={styles} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

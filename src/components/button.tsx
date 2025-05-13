"use client";
import Link  from "next/link";
import { ReactNode } from "react";

interface ButtonProps{
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "disabled" | "danger";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type,
  ...props
}: ButtonProps) {
  const base =
    "px-8 py-3 transition-colors duration-200 inline-block text-center cursor-pointer w-full max-w-300 whitespace-nowrap";

  const variants = {
    primary: "bg-[var(--primary-color)] text-white hover:bg-[#60469C]",
    secondary: "bg-[var(--secondary-color)] text-white hover:bg-[#71648F]",
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
        disabled={variant === "disabled"}
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
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
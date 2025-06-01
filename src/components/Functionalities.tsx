"use client";

import { useEffect } from "react";
import signupImage from "../assets/process-signup.avif";
import journeyImage from "../assets/process-journey.avif";
import trackImage from "../assets/process-track.avif";
import leaderboardImage from "../assets/process-leaderboard.avif";
import Link from "next/link";
import Functionality from "./Functionality";

const navigationLinks = [
  { href: "#gamification", label: "Gamified Progression" },
  { href: "#ranking", label: "Monthly Rankings" },
  { href: "#metrics", label: "Success Metrics" },
  { href: "#login", label: "Secure Login" },
];

const functionalitiesData = [
  {
    id: "gamification",
    src: signupImage,
    altText: "Gamified progression illustration",
    heading: "10 challenges per level. No skipping, earn your way up.",
    description:
      "Master each concept with ten bite-sized, interactive challenges per level. No skipping ahead—earn your progress and build a solid foundation, one level at a time.",
  },
  {
    id: "ranking",
    src: journeyImage,
    altText: "Monthly rankings illustration",
    heading: "Climb the leaderboard and compete every month.",
    description:
      "Rise through the ranks by completing challenges and earning points. Compete with users around the world each month and claim your spot at the top of the leaderboard.",
  },
  {
    id: "metrics",
    src: trackImage,
    altText: "Success metrics illustration",
    heading: "Track your progress, accuracy, and streaks.",
    description:
      "Stay motivated by tracking your learning journey. Monitor your challenge accuracy, daily streaks, and level progression—all in one place.",
  },
  {
    id: "login",
    src: leaderboardImage,
    altText: "Secure login illustration",
    heading: "Save progress and sync across all devices.",
    description:
      "Never lose your progress. Your learning is automatically saved and seamlessly synced across all your devices—start on your phone, continue on your laptop.",
  },
];

function useActiveSection() {
  useEffect(() => {
    const sections = document.querySelectorAll("div[id]");
    const navLinks = document.querySelectorAll(".functionalities-link");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute("id");
          const navLink = document.querySelector(
            `.functionalities-link[href="#${id}"]`,
          );
          if (entry.isIntersecting) {
            navLinks.forEach(link => link.removeAttribute("data-active"));
            if (navLink) navLink.setAttribute("data-active", "true");
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);
}

export default function Functionalities() {
  useActiveSection();

  return (
    <div className="md:grid md:grid-cols-[1fr_2fr] relative items-start">
      <nav className="flex md:flex-col flex-row sticky md:top-32 top-14 md:text-left text-center bg-[var(--background-color)] py-6 justify-between">
        {navigationLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            replace
            className="functionalities-link text-[var(--unavailable-text)] data-[active=true]:text-[var(--primary-color)] transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-8">
        {functionalitiesData.map(
          ({ id, src, altText, heading, description }) => (
            <Functionality
              key={id}
              id={id}
              src={src}
              altText={altText}
              heading={heading}
              description={description}
            />
          ),
        )}
      </div>
    </div>
  );
}

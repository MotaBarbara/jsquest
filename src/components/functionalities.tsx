"use client";

import { useEffect } from "react";
import signupImage from "../assets/process-signup.avif";
import journeyImage from "../assets/process-journey.avif";
import trackImage from "../assets/process-track.avif";
import leaderboardImage from "../assets/process-leaderboard.avif";

import Link from "next/link";
import Functionality from "./functionality";

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
      <div className="flex md:flex-col flex-row sticky md:top-32 top-12 md:text-left text-center bg-[var(--background-color)] py-2 justify-between">
        <Link
          href="#gamification"
          replace
          className="functionalities-link text-[var(--unavailable-text)] data-[active=true]:text-[var(--primary-color)] transition-colors"
        >
          Gamified Progression
        </Link>
        <Link
          href="#ranking"
          replace
          className="functionalities-link text-[var(--unavailable-text)] data-[active=true]:text-[var(--primary-color)] transition-colors"
        >
          Monthly Rankings
        </Link>
        <Link
          href="#metrics"
          replace
          className="functionalities-link text-[var(--unavailable-text)] data-[active=true]:text-[var(--primary-color)] transition-colors"
        >
          Success Metrics
        </Link>
        <Link
          href="#login"
          replace
          className="functionalities-link text-[var(--unavailable-text)] data-[active=true]:text-[var(--primary-color)] transition-colors"
        >
          Secure Login
        </Link>
      </div>
      <div className="flex flex-col gap-8">
        <Functionality
          id="gamification"
          src={signupImage}
          altText=""
          heading="10 challenges per level. No skipping, earn your way up."
          description="Master each concept with ten bite-sized, interactive challenges per
            level. No skipping ahead—earn your progress and build a solid
            foundation, one level at a time."
        />
        <Functionality
          id="ranking"
          src={journeyImage}
          altText=""
          heading="Climb the leaderboard and compete every month."
          description="Rise through the ranks by completing challenges and earning points.
            Compete with users around the world each month and claim your spot
            at the top of the leaderboard."
        />
        <Functionality
          id="metrics"
          src={trackImage}
          altText=""
          heading="Track your progress, accuracy, and streaks."
          description="Stay motivated by tracking your learning journey. Monitor your
            challenge accuracy, daily streaks, and level progression—all in one
            place."
        />
        <Functionality
          id="login"
          src={leaderboardImage}
          altText=""
          heading="Save progress and sync across all devices."
          description="Never lose your progress. Your learning is automatically saved and
            seamlessly synced across all your devices—start on your phone,
            continue on your laptop."
        />
      </div>
    </div>
  );
}

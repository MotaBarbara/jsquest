"use client";

import { useEffect } from "react";
import Image from "next/image";
import signupImage from "../assets/process-signup.avif";
import journeyImage from "../assets/process-journey.avif";
import trackImage from "../assets/process-track.avif";
import leaderboardImage from "../assets/process-leaderboard.avif";

import Link from "next/link";

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
    <div className="flex relative items-start">
      <div className="flex flex-col sticky top-32">
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
      <div>
        <div className="h-[100vh] px-16 py-32" id="gamification">
          <Image src={signupImage} alt="" />
          <p>10 challenges per level. No skipping, earn your way up.</p>
        </div>
        <div className="h-[100vh] px-16 py-32" id="ranking">
          <Image src={journeyImage} alt="" />
          <p>Climb the leaderboard and compete every month.</p>
        </div>
        <div className="h-[100vh] px-16 py-32" id="metrics">
          <Image src={trackImage} alt="" />
          <p>Track your progress, accuracy, and streaks.</p>
        </div>
        <div className="h-[100vh] px-16 py-32" id="login">
          <Image src={leaderboardImage} alt="" />
          <p>Save progress and sync across all devices.</p>
        </div>
      </div>
    </div>
  );
}

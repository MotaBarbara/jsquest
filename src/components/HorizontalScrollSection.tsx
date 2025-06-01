"use client";

import { useEffect, useRef, useState } from "react";
import signupImage from "../assets/process-signup.avif";
import journeyImage from "../assets/process-journey.avif";
import trackImage from "../assets/process-track.avif";
import leaderboardImage from "../assets/process-leaderboard.avif";
import ProcessStep from "./ProcessStage";

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      try {
        const section = sectionRef.current;
        const horizontal = horizontalRef.current;
        if (!section || !horizontal) return;

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollY = window.scrollY;
        const offset = window.innerHeight;

        if (
          scrollY >= sectionTop + offset &&
          scrollY <= sectionTop + sectionHeight
        ) {
          const maxScroll = horizontal.scrollWidth - window.innerWidth;
          const scrollDistance = Math.min(
            scrollY - (sectionTop + offset),
            maxScroll,
          );
          horizontal.style.transform = `translateX(-${scrollDistance}px)`;
        }
      } catch (err) {
        setError("Error calculating scroll position");
        console.error("Scroll calculation error:", err);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-[400vh] relative"
      role="region"
      aria-label="Process steps"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="max-w-120 text-center mx-auto mb-16">
          <h2 className="h2-lp mb-3">
            The Ultimate JavaScript Challenge Platform
          </h2>
          <p>
            Master JavaScript through interactive challenges, track your
            progress, and compete with others.
          </p>
        </div>
        {error && (
          <div className="text-[var(--danger)] text-center mb-4">{error}</div>
        )}
        <div
          ref={horizontalRef}
          className="flex gap-10 md:w-[400vw] w-[280vh] transition-transform duration-300 ease-out"
          role="list"
          aria-label="Process steps"
        >
          <ProcessStep
            src={signupImage}
            altText="Sign up process illustration"
            heading="Sign Up & Start"
            description="Create your free account and dive into your first challenge in seconds - no setup, no fluff."
          />
          <ProcessStep
            src={journeyImage}
            altText="Level-based challenges illustration"
            heading="Level-Based Challenges"
            description="Progress through structured JavaScript exercises, one level at a time - no skipping allowed, mastery required."
          />
          <ProcessStep
            src={trackImage}
            altText="Progress tracking illustration"
            heading="Track Progress"
            description="Get instant feedback, track your growth, and see how you stack up."
          />
          <ProcessStep
            src={leaderboardImage}
            altText="Leaderboard competition illustration"
            heading="Join Leaderboard"
            description="Compete, climb ranks, and show your JavaScript mastery."
          />
        </div>
      </div>
    </div>
  );
}

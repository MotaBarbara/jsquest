"use client";

import { useEffect, useRef } from "react";
import signupImage from "../assets/process-signup.avif";
import journeyImage from "../assets/process-journey.avif";
import trackImage from "../assets/process-track.avif";
import leaderboardImage from "../assets/process-leaderboard.avif";
import ProcessStep from "./processStep";

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const horizontal = horizontalRef.current;
      if (!section || !horizontal) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;
      // const scrollDistance = scrollY - sectionTop;
      const offset = window.innerHeight / 2; // or any px value like 200

      if (
        scrollY >= sectionTop + offset &&
        scrollY <= sectionTop + sectionHeight
      ) {
        const scrollDistance = scrollY - (sectionTop + offset);
        horizontal.style.transform = `translateX(-${scrollDistance}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="h-[400vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="max-w-120 text-center mx-auto mb-16">
          <h2 className="h2-lp mb-3">
            The Ultimate JavaScript Challenge Platform
          </h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
            repellat aperiam rerum dolor exercitationem?
          </p>
        </div>
        <div
          ref={horizontalRef}
          className="flex gap-10 w-[400vw] transition-transform duration-300 ease-out"
        >
          <ProcessStep
            src={signupImage}
            altText="Sign up"
            heading="Sign Up & Start"
            description="Create your free account and dive into your first challenge in seconds - no setup, no fluff."
          />
          <ProcessStep
            src={journeyImage}
            altText="Journey"
            heading="Level-Based Challenges"
            description="Progress through structured JavaScript exercises, one level at a time - no skipping allowed, mastery required."
          />
          <ProcessStep
            src={trackImage}
            altText="Track progress"
            heading="Track Progress"
            description="Get instant feedback, track your growth, and see how you stack up."
          />
          <ProcessStep
            src={leaderboardImage}
            altText="Leaderboard"
            heading="Join Leaderboard"
            description="Compete, climb ranks, and show your JavaScript mastery."
          />
        </div>
      </div>
    </section>
  );
}

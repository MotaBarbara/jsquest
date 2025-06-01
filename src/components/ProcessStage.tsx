"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ProcessStepProps } from "../types/props";

export default function ProcessStep({
  src,
  altText,
  heading,
  description,
  topMargin,
}: ProcessStepProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkViewport(); // initial check
    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row items-end gap-6 md:w-[100vh] md:max-w-[90vw] bg-[var(--secondary-background)] p-6 md:relative sticky max-w-[400px] md:m-0 md:mt-12 m-auto  md:top-0"
      role="article"
      style={isMobile ? { top: topMargin } : undefined}
      aria-label={`Process step: ${heading}`}
    >
      <div className="w-full md:w-[50vh] h-[40vh] md:min-w-[50vh] max-w-[100%] relative">
        {imageLoading && (
          <div className="animate-pulse bg-gray-200 w-full h-full absolute" />
        )}
        <Image
          src={src}
          alt={altText || `${heading} illustration`}
          fill
          style={{ objectFit: "cover" }}
          className={imageLoading ? "opacity-0" : "opacity-100"}
          onLoad={() => setImageLoading(false)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3>{heading}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

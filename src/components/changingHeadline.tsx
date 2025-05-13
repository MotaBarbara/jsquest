// ChangingHeadline.tsx
"use client";
import { useEffect, useState } from "react";

const messages = [
  "Become a developer",
  "Land in a tech job",
  "Launch your app",
  "Learn by building",
  "Join the top 1%",
];

export default function TypewriterEffect() {
  const [displayed, setDisplayed] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    let timeout: NodeJS.Timeout;

    if (typing) {
      if (displayed.length < currentMessage.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentMessage.slice(0, displayed.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 1000); // pause before deleting
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(currentMessage.slice(0, displayed.length - 1));
        }, 40);
      } else {
        setTyping(true);
        setMessageIndex(prev => (prev + 1) % messages.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, typing, messageIndex]);

  return (
    <span className="inline-block whitespace-nowrap animate-pulse">
      {displayed}
    </span>
  );
}

import Image from "next/image";
import { FunctionalityCardProps } from "../types/props";

export default function Functionality({
  src,
  altText,
  heading,
  description,
  id,
}: FunctionalityCardProps) {
  return (
    <div className="p-8 bg-[var(--secondary-background)]" id={id}>
      <Image
        src={src}
        alt={altText || `${heading} illustration`}
        width={400}
        height={300}
        className="w-full h-auto"
      />
      <h3 className="mt-8 mb-3 h3-lp">{heading}</h3>
      <p>{description}</p>
    </div>
  );
}

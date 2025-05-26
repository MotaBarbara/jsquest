import Image from "next/image";
import { StaticImageData } from "next/image";

interface ProcessStepProps {
  src: StaticImageData;
  altText: string;
  heading: string;
  description: string;
}

export default function ProcessStep({
  src,
  altText,
  heading,
  description,
}: ProcessStepProps) {
  return (
    <div className="flex flex-col md:flex-row items-end gap-6 md:w-[100vh] max-w-[90vw] bg-[var(--secondary-background)] p-6">
      <div className="w-[50vh] h-[40vh] md:min-w-[50vh] max-w-[100%] relative">
        <Image src={src} alt={altText} fill style={{ objectFit: "cover" }} />
      </div>
      <div className="flex flex-col gap-2">
        <h3>{heading}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

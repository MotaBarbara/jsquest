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
    <div className="flex items-end gap-6 w-[100vh] bg-[var(--secondary-background)] p-6">
      <div className="w-[50vh] h-[40vh] min-w-[50vh] relative">
        <Image src={src} alt={altText} fill style={{ objectFit: "cover" }} />
      </div>
      <div className="flex flex-col gap-2">
        <h3>{heading}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

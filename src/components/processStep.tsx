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
    <div className="flex items-end gap-8 w-200">
      <Image src={src} alt={altText} width={400} height={320} />
      <div className="flex flex-col gap-2">
        <h3>{heading}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

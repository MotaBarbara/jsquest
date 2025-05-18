import Image from "next/image";
import { StaticImageData } from "next/image";

interface FunctionlityCardProps {
  src: StaticImageData;
  altText: string;
  heading: string;
  description: string;
  id: string;
}

export default function Functionality({
  src,
  altText,
  heading,
  description,
  id,
}: FunctionlityCardProps) {
  return (
    <div className="p-8 bg-[var(--secondary-background)]" id={id}>
      <Image src={src} alt={altText} />
      <h3 className="mt-8 mb-3 h3-lp">{heading}</h3>
      <p>{description}</p>
    </div>
  );
}

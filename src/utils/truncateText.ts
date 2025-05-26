export default function TruncateText(
  text: string,
  maxLength: number = 15,
): string {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

import { useEffect, useState } from "react";

interface Props {
  words: string[];
  interval?: number;
  className?: string;
}

export const WordRotate = ({ words, interval = 2600, className = "" }: Props) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span className={`relative inline-block align-baseline ${className}`}>
      <span className="invisible whitespace-nowrap">{words.reduce((a, b) => (a.length > b.length ? a : b), "")}</span>
      <span
        key={i}
        className="absolute inset-0 whitespace-nowrap animate-fade-up h-serif text-gradient"
      >
        {words[i]}
      </span>
    </span>
  );
};

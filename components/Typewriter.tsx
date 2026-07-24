"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
    text: string;
    /** Milliseconds per character */
    speed?: number;
    /** Milliseconds before typing starts */
    startDelay?: number;
    className?: string;
}

export default function Typewriter({
    text,
    speed = 90,
    startDelay = 400,
    className,
}: TypewriterProps) {
    const [length, setLength] = useState(0);

    useEffect(() => {
        setLength(0);
        let interval: ReturnType<typeof setInterval> | undefined;
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setLength((current) => {
                    if (current >= text.length) {
                        clearInterval(interval);
                        return current;
                    }
                    return current + 1;
                });
            }, speed);
        }, startDelay);
        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, speed, startDelay]);

    return (
        <span className={cn("whitespace-pre-wrap", className)} aria-label={text}>
            <span aria-hidden>{text.slice(0, length)}</span>
            <span
                aria-hidden
                className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.12em] bg-secondary animate-caret-blink"
            />
        </span>
    );
}

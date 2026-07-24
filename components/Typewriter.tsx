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

    const caret = (
        <span className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.12em] bg-secondary animate-caret-blink" />
    );

    // The full text is rendered invisibly to reserve the final box. The typed
    // text is overlaid on top at the same width, so it wraps at exactly the
    // same points and the block never grows a line mid-animation — otherwise
    // the headline jumps when it wraps on narrow screens.
    return (
        <span className={cn("relative block whitespace-pre-wrap", className)} aria-label={text}>
            <span aria-hidden className="invisible">
                {text}
                {caret}
            </span>
            <span aria-hidden className="absolute inset-0">
                {text.slice(0, length)}
                {caret}
            </span>
        </span>
    );
}

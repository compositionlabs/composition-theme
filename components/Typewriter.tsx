"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
    text: string;
    /** Milliseconds per character */
    speed?: number;
    /** Milliseconds before typing starts */
    startDelay?: number;
    className?: string;
}

interface Line {
    /** Index in `text` where this line begins */
    start: number;
    /** The line's text, trailing space trimmed */
    content: string;
}

export default function Typewriter({
    text,
    speed = 90,
    startDelay = 400,
    className,
}: TypewriterProps) {
    const [length, setLength] = useState(0);
    const [lines, setLines] = useState<Line[] | null>(null);
    const measureRef = useRef<HTMLSpanElement>(null);

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

    // Find where the browser wraps the *complete* headline, so typing can fill
    // those fixed lines. Without this the partial text re-wraps as it grows: a
    // word starts at the end of one line, then jumps to the next once it no
    // longer fits.
    useEffect(() => {
        const el = measureRef.current;
        if (!el) return;

        const measure = () => {
            const node = el.firstChild;
            if (!node) return;
            const range = document.createRange();
            const starts = [0];
            let lastTop: number | null = null;
            for (let i = 0; i < text.length; i++) {
                range.setStart(node, i);
                range.setEnd(node, i + 1);
                const rect = range.getClientRects()[0];
                if (!rect) continue;
                if (lastTop === null) {
                    lastTop = rect.top;
                } else if (rect.top - lastTop > 1) {
                    starts.push(i);
                    lastTop = rect.top;
                }
            }
            setLines(
                starts.map((start, i) => ({
                    start,
                    content: text
                        .slice(start, starts[i + 1] ?? text.length)
                        .replace(/\s+$/, ""),
                })),
            );
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        if (document.fonts) {
            document.fonts.ready.then(measure).catch(() => {});
        }
        return () => observer.disconnect();
    }, [text]);

    // Zero-width wrapper: the caret is drawn over the reserved space rather
    // than taking any of its own, so it can't nudge the text or the wrapping.
    const caret = (
        <span className="relative inline-block h-0 w-0 align-baseline">
            <span className="absolute left-1 bottom-[-0.12em] h-[1em] w-[0.5em] bg-secondary animate-caret-blink" />
        </span>
    );

    const activeLine = lines
        ? lines.reduce((active, line, i) => (length >= line.start ? i : active), 0)
        : 0;

    return (
        <span className={cn("relative block", className)} aria-label={text}>
            {/* Reserves the final box and provides the wrap measurement */}
            <span ref={measureRef} aria-hidden className="invisible whitespace-pre-wrap">
                {text}
            </span>
            {/* Typed text, overlaid on the reserved box. Each line keeps its
                full width via an invisible remainder, so characters land in
                their final positions instead of sliding as the line centers. */}
            <span aria-hidden className="absolute inset-0 whitespace-pre-wrap">
                {lines
                    ? lines.map((line, i) => {
                          const typed = Math.max(
                              0,
                              Math.min(line.content.length, length - line.start),
                          );
                          return (
                              <span key={i} className="block whitespace-pre">
                                  <span>{line.content.slice(0, typed)}</span>
                                  {i === activeLine && caret}
                                  <span className="invisible">
                                      {line.content.slice(typed)}
                                  </span>
                              </span>
                          );
                      })
                    : text.slice(0, length)}
            </span>
        </span>
    );
}

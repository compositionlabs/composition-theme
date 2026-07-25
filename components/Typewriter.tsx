"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
    /** The line's text — always whole words */
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

    // Words and the whitespace between them, each tagged with its offset in `text`.
    const tokens = useMemo(() => {
        let index = 0;
        return text
            .split(/(\s+)/)
            .filter(Boolean)
            .map((value) => {
                const token = { value, start: index, isSpace: /^\s+$/.test(value) };
                index += value.length;
                return token;
            });
    }, [text]);

    // Group the words by the line they land on, so typing can fill those fixed
    // lines. Without this the partial text re-wraps as it grows: a word starts
    // at the end of one line, then pops down to the next once it stops fitting.
    useEffect(() => {
        const el = measureRef.current;
        if (!el) return;

        const measure = () => {
            const words = el.querySelectorAll<HTMLElement>("[data-start]");
            const groups: { start: number; end: number }[] = [];
            let lastTop: number | null = null;
            words.forEach((word) => {
                const start = Number(word.dataset.start);
                const end = start + (word.textContent?.length ?? 0);
                const { top } = word.getBoundingClientRect();
                if (lastTop === null || Math.abs(top - lastTop) > 1) {
                    groups.push({ start, end });
                    lastTop = top;
                } else {
                    groups[groups.length - 1].end = end;
                }
            });
            if (!groups.length) return;

            const next = groups.map(({ start, end }) => ({
                start,
                content: text.slice(start, end),
            }));
            setLines((prev) =>
                prev &&
                prev.length === next.length &&
                prev.every((line, i) => line.start === next[i].start && line.content === next[i].content)
                    ? prev
                    : next,
            );
        };

        measure();
        // Observes a block box — a ResizeObserver on an inline element never fires,
        // which would leave the lines stale (and overflowing) after a resize.
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        if (document.fonts) {
            document.fonts.ready.then(measure).catch(() => {});
        }
        return () => observer.disconnect();
    }, [text, tokens]);

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
            {/* Reserves the final box and provides the wrap measurement. Each word
                is nowrap, so a line can only ever break between whole words. The
                trailing pad is the caret's room: without it a line that exactly
                fills the width pushes the caret off the edge and the page gains
                a horizontal scrollbar. */}
            <span
                ref={measureRef}
                aria-hidden
                className="invisible block whitespace-pre-wrap pr-[calc(0.5em+0.25rem)]"
            >
                {tokens.map((token, i) =>
                    token.isSpace ? (
                        <span key={i}>{token.value}</span>
                    ) : (
                        <span key={i} data-start={token.start} className="whitespace-nowrap">
                            {token.value}
                        </span>
                    ),
                )}
            </span>
            {/* Typed text, overlaid on the reserved box. Each line keeps its
                full width via an invisible remainder, so characters land in
                their final positions instead of sliding as the line centers. */}
            <span
                aria-hidden
                className="absolute inset-0 whitespace-pre-wrap pr-[calc(0.5em+0.25rem)]"
            >
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

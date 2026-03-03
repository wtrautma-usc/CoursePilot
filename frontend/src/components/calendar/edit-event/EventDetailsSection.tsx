"use client";

/**
 * ------------------------------------------------------------------
 * EventDetailsSection.tsx
 * ------------------------------------------------------------------
 *
 * This component renders the entire "Event Details" section inside
 * the EditEventModal.
 *
 * It includes:
 *  - Section heading with divider line
 *  - Editable event title with pencil icon
 *  - Auto-sizing underline that matches title length
 *  - Time + Date display row
 *  - "Join meeting" placeholder button
 *
 * The title:
 *  - Is NOT editable by default
 *  - Becomes editable when pencil is clicked
 *  - Shows underline (#A4A9AD) while editing
 *  - Underline width grows/shrinks with text length
 *  - Saves on Enter or blur
 *  - Cancels on Escape
 *
 * This component is UI-focused.
 * It receives title state + commit/cancel handlers from parent.
 *
 * ------------------------------------------------------------------
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Minimal event type needed for this section.
 * Keeps this component independent and reusable.
 */
type EventLike = {
  id: string;
  title: string;
  start: Date;
  end?: Date;
};

type Props = {
  event: EventLike;
  titleDraft: string;
  setTitleDraft: (value: string) => void;
  onCommitTitle: () => void;
  onCancelTitle: () => void;
};

/**
 * Formats time range like:
 * "8:30 PM - 9:30 PM"
 */
function formatTimeRange(start: Date, end?: Date) {
  const startLabel = start.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (!end) return startLabel;

  const endLabel = end.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startLabel} - ${endLabel}`;
}

/**
 * Formats date like:
 * "March 3"
 */
function formatDateLabel(d: Date) {
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
}

/**
 * Small reusable heading with divider line
 */
function HeadingWithLine({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "15px 0 8px",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "#000000" }}>
        {title}
      </div>
      <div style={{ flex: 1, height: 1, background: "#A4A9AD" }} />
    </div>
  );
}

/**
 * ------------------------------------------------------------------
 * Main Component
 * ------------------------------------------------------------------
 */

export default function EventDetailsSection({
  event,
  titleDraft,
  setTitleDraft,
  onCommitTitle,
  onCancelTitle,
}: Props) {
  /**
   * Controls whether the title is in edit mode.
   */
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  /**
   * Ref to the input element so we can:
   *  - Focus automatically
   *  - Select all text when editing starts
   */
  const titleInputRef = useRef<HTMLInputElement>(null);

  /**
   * These are used to measure text width dynamically
   * so the underline matches the exact title length.
   */
  const measureRef = useRef<HTMLSpanElement>(null);
  const [titleInputWidthPx, setTitleInputWidthPx] = useState<number>(40);

  /**
   * Exit edit mode if a different event is opened.
   */
  useEffect(() => {
    setIsEditingTitle(false);
  }, [event.id]);

  /**
   * Auto-focus + select text when entering edit mode.
   */
  useEffect(() => {
    if (!isEditingTitle) return;

    requestAnimationFrame(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    });
  }, [isEditingTitle]);

  /**
   * Measure the width of the text using a hidden span
   * so the underline matches exactly.
   *
   * We add a few pixels for caret spacing.
   */
  useLayoutEffect(() => {
    const text = titleDraft || " ";

    if (measureRef.current) {
      measureRef.current.textContent = text;
      const width =
        Math.ceil(measureRef.current.getBoundingClientRect().width) + 6;

      setTitleInputWidthPx(Math.max(40, width));
    }
  }, [titleDraft]);

  return (
    <>
      <HeadingWithLine title="Event Details" />

      {/* ---------------- Title Row ---------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Non-edit mode */}
          {!isEditingTitle ? (
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#000000",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {titleDraft || "Untitled event"}
            </div>
          ) : (
            /* Edit mode */
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Hidden measurer element */}
              <span
                ref={measureRef}
                style={{
                  position: "absolute",
                  visibility: "hidden",
                  whiteSpace: "pre",
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                }}
              />

              <input
                ref={titleInputRef}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={() => {
                  onCommitTitle();
                  setIsEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onCommitTitle();
                    setIsEditingTitle(false);
                  }

                  if (e.key === "Escape") {
                    e.preventDefault();
                    onCancelTitle();
                    setIsEditingTitle(false);
                  }
                }}
                style={{
                  width: titleInputWidthPx,
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#000000",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  borderBottom: "1px solid #A4A9AD", // Underline color
                  paddingBottom: 2,
                }}
                aria-label="Edit event title"
              />
            </div>
          )}
        </div>

        {/* Pencil Icon */}
        <button
          type="button"
          onClick={() => setIsEditingTitle(true)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            opacity: 0.8,
          }}
          aria-label="Edit title"
        >
          <Image
            src="/icons/Edit_Pencil_01.svg"
            alt="Edit"
            width={16}
            height={16}
            draggable={false}
          />
        </button>
      </div>

      {/* ---------------- Time + Date Row ---------------- */}
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
          marginBottom: 14,
          color: "#111827",
          fontSize: 13,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
          {formatTimeRange(event.start, event.end)}
        </span>

        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Image src="/icons/calendar.svg" alt="Date" width={16} height={16} />
          {formatDateLabel(event.start)}
        </span>
      </div>

      {/* ---------------- Join Meeting Button ---------------- */}
      <button
        type="button"
        style={{
          border: "1px solid #e5e7eb",
          background: "#f3f4f6",
          borderRadius: 10,
          padding: "8px 12px",
          fontSize: 12,
          cursor: "not-allowed",
          opacity: 0.7,
          marginBottom: 8,
        }}
        disabled
      >
        Join meeting
      </button>
    </>
  );
}
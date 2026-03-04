"use client";

import type { CalendarEvent } from "./types";
import { EVENT_PILL_BG } from "./constants";

const PILL_HEIGHT = 26;
const PILL_PADDING_X = 8;
const PILL_FONT_SIZE = 11;

type EventPillProps = {
  event: CalendarEvent;
  onClick: () => void;
};

export default function EventPill({ event, onClick }: EventPillProps) {
  const bg =
    event.color in EVENT_PILL_BG
      ? EVENT_PILL_BG[event.color as keyof typeof EVENT_PILL_BG]
      : String(event.color).startsWith("#")
        ? event.color
        : EVENT_PILL_BG.teal;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        height: PILL_HEIGHT,
        width: "100%",
        borderRadius: 6,
        padding: `0 ${PILL_PADDING_X}px`,
        display: "flex",
        alignItems: "center",
        fontSize: PILL_FONT_SIZE,
        fontWeight: 500,
        color: "#fff",
        background: bg,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer",
      }}
      title={event.title}
    >
      {event.title}
    </div>
  );
}

export { PILL_HEIGHT, PILL_PADDING_X, PILL_FONT_SIZE };

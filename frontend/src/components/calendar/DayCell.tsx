"use client";

import type { CalendarEvent } from "./types";
import { CALENDAR_COLORS } from "./constants";
import EventPill, { PILL_HEIGHT } from "./EventPill";

const CELL_PADDING = 6;
const PILL_GAP = 3;
const SEE_MORE_H = 14;
const TWO_PILLS_H = PILL_HEIGHT * 2 + PILL_GAP;
const RESERVED_EVENTS_AREA_H = TWO_PILLS_H;
const RESERVED_EVENTS_AREA_H_EXPANDED = TWO_PILLS_H + SEE_MORE_H;

type DayCellProps = {
  cellDate: Date;
  currentMonth: number;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

export default function DayCell({
  cellDate,
  currentMonth,
  events,
  onEventClick,
}: DayCellProps) {
  const now = new Date();
  const isCurrentDay =
    cellDate.getDate() === now.getDate() &&
    cellDate.getMonth() === now.getMonth() &&
    cellDate.getFullYear() === now.getFullYear();
  const isOtherMonth = cellDate.getMonth() !== currentMonth;
  const count = events.length;
  const isExpandedCell = count >= 3;

  return (
    <div
      style={{
        border: `1px solid ${CALENDAR_COLORS.borderGray}`,
        padding: CELL_PADDING,
        background: isOtherMonth ? CALENDAR_COLORS.lightGray : "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...(isCurrentDay && { border: "2px solid #4A90E2" }),
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {cellDate.getDate()}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: PILL_GAP,
          overflow: "hidden",
          height: isExpandedCell
            ? RESERVED_EVENTS_AREA_H_EXPANDED
            : RESERVED_EVENTS_AREA_H,
        }}
      >
        {events.slice(0, 2).map((ev) => (
          <EventPill
            key={ev.id}
            event={ev}
            onClick={() => onEventClick(ev)}
          />
        ))}

        {count >= 3 && (
          <div
            style={{
              fontSize: 11,
              color: "#9CA3AF",
              lineHeight: "12px",
              marginTop: 0,
              userSelect: "none",
            }}
          >
            See more
          </div>
        )}
      </div>
    </div>
  );
}

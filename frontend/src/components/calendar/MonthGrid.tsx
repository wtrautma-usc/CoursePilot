"use client";

import { useMemo, useState } from "react";
import AddEventModal from "./AddEventModal";
import MonthNav from "./MonthNav";
import AddEventButton from "./AddEventButton";
import ViewToggle from "./ViewToggle";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/* ========== COLOR PALETTE ========== */
const COLORS = {
  coral: "#E07856",
  yellow: "#F4B860",
  purple: "#B8A4D4",
  teal: "#20A39E",
  borderGray: "#e5e5e5",
  textGray: "#23001E",
  lightGray: "#fafafa",

  // Figma greys
  navBtnBg: "#D9D9D9",
  navIcon: "#9B9B9B",
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  color: "coral" | "yellow" | "purple" | "teal";
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function MonthGrid() {
  const [displayDate, setDisplayDate] = useState(() => new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  function goToPreviousMonth() {
    setDisplayDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setDisplayDate(new Date(year, month + 1, 1));
  }

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday start
  const startingDayOfWeek = firstDay === 0 ? 6 : firstDay - 1;
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

  const calendarDays: Date[] = Array.from({ length: totalCells }).map(
    (_, i) => {
      const dayIndex = i - startingDayOfWeek + 1;
      return new Date(year, month, dayIndex);
    },
  );

  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  // ✅ NOW: calendar only "expands" (scrolls) if any day has 3+ events.
  const isExpandedCalendar = useMemo(() => {
    for (const d of calendarDays) {
      const count = events.filter((e) => isSameDay(e.start, d)).length;
      if (count >= 3) return true;
    }
    return false;
  }, [events, calendarDays]);

  // ✅ Cell sizing
  // Compact must fit 0, 1, OR 2 events (no resize)
  const COMPACT_CELL_MIN_H = 86;
  const EXPANDED_CELL_MIN_H = 118; // only used for 3+ (room for "See more")

  // Events area height:
  // - Compact shows up to 2 pills
  // - Expanded shows 2 pills + "See more"
  const COMPACT_EVENTS_AREA_H = 50; // enough for 2 compact pills
  const EXPANDED_EVENTS_AREA_H = 74; // enough for 2 pills + "See more"

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ========== CALENDAR HEADER ========== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        {/* LEFT BUTTONS */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ViewToggle value={viewMode} onChange={setViewMode} />

          <button
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              padding: "8px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            ⚙
          </button>

          <AddEventButton onClick={() => setIsAddOpen(true)} />
        </div>

        {/* CENTER MONTH / YEAR */}
        <MonthNav
          label={`${monthNames[month]} ${year}`}
          onPrev={goToPreviousMonth}
          onNext={goToNextMonth}
        />

        <div />
      </div>

      {/* ✅ MODAL */}
      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(data) => {
          const [hh, mm] = (data.startTime ?? "09:00").split(":").map(Number);
          const [yyyy, monthStr, dayStr] = data.startDate.split("-").map(Number);

          const start = new Date(yyyy, monthStr - 1, dayStr, hh, mm);

          const colorName: CalendarEvent["color"] =
            data.color === COLORS.yellow
              ? "yellow"
              : data.color === COLORS.purple
                ? "purple"
                : data.color === COLORS.teal
                  ? "teal"
                  : "coral";

          const newEvent: CalendarEvent = {
            id: crypto.randomUUID(),
            title: data.title,
            start,
            color: colorName,
          };

          setEvents((prev) => [...prev, newEvent]);
          setIsAddOpen(false);
        }}
      />

      {/* ========== CALENDAR GRID CONTAINER ========== */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          flex: 1,
          overflow: isExpandedCalendar ? "auto" : "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Day Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0,
            flexShrink: 0,
            height: 44,
          }}
        >
          {days.map((d) => (
            <div
              key={d}
              style={{
                border: `1px solid ${COLORS.borderGray}`,
                background: "#fff",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                padding: "8px 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: "24px",
                color: "#6F7C8A",
                letterSpacing: "0.5px",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0,
            alignItems: "stretch",
          }}
        >
          {calendarDays.map((cellDate, i) => {
            const now = new Date();
            const cellDayNum = cellDate.getDate();

            const isCurrentDay =
              cellDate.getDate() === now.getDate() &&
              cellDate.getMonth() === now.getMonth() &&
              cellDate.getFullYear() === now.getFullYear();

            const isOtherMonth = cellDate.getMonth() !== month;

            const eventsForThisDay = events
              .filter((e) => isSameDay(e.start, cellDate))
              .sort((a, b) => a.start.getTime() - b.start.getTime());

            const count = eventsForThisDay.length;

            // ✅ Only expand for 3+ (because of "See more")
            const isExpandedCell = count >= 3;

            const cellMinHeight = isExpandedCell
              ? EXPANDED_CELL_MIN_H
              : COMPACT_CELL_MIN_H;

            const eventsAreaHeight = isExpandedCell
              ? EXPANDED_EVENTS_AREA_H
              : COMPACT_EVENTS_AREA_H;

            // ✅ If exactly 2 events, tighten spacing/pill styling so it fits compactly
            const isTwoEventsCompact = count === 2;

            const pillHeight = isTwoEventsCompact ? 22 : 24;
            const pillPaddingX = isTwoEventsCompact ? 6 : 8;
            const pillFontSize = isTwoEventsCompact ? 9 : 10;
            const listGap = isTwoEventsCompact ? 2 : 4;

            return (
              <div
                key={i}
                style={{
                  border: `1px solid ${COLORS.borderGray}`,
                  minHeight: cellMinHeight,
                  padding: 8,
                  background: isOtherMonth ? COLORS.lightGray : "#fff",
                  position: "relative",
                  overflow: "hidden",
                  ...(isCurrentDay && { border: "2px solid #4A90E2" }),
                }}
              >
                {/* Day number */}
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                    color: isOtherMonth ? COLORS.textGray : "#000",
                  }}
                >
                  {cellDayNum}
                </div>

                {/* Events area */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: listGap,
                    overflow: "hidden",
                    height: eventsAreaHeight,
                  }}
                >
                  {eventsForThisDay.slice(0, 2).map((ev) => {
                    const bg =
                      ev.color === "coral"
                        ? "rgba(239, 91, 91, 0.85)"
                        : ev.color === "yellow"
                          ? "rgba(255, 186, 73, 1)"
                          : ev.color === "purple"
                            ? "rgba(184, 164, 212, 0.9)"
                            : "rgba(32, 163, 158, 0.9)";

                    const timeLabel = ev.start.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={ev.id}
                        style={{
                          height: pillHeight,
                          borderRadius: 6,
                          padding: `0 ${pillPaddingX}px`,
                          display: "flex",
                          alignItems: "center",
                          background: bg,
                        }}
                        title={`${timeLabel} ${ev.title}`}
                      >
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: pillFontSize,
                            fontWeight: 500,
                            lineHeight: "16px",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                          }}
                        >
                          {timeLabel} {ev.title}
                        </span>
                      </div>
                    );
                  })}

                  {/* ✅ Only show See more when 3+ */}
                  {count >= 3 && (
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 12,
                        lineHeight: "14px",
                        color: "#9CA3AF",
                        marginTop: 2,
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => {
                        alert(
                          eventsForThisDay
                            .map((e) => {
                              const t = e.start.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              });
                              return `${t} ${e.title}`;
                            })
                            .join("\n"),
                        );
                      }}
                    >
                      See more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
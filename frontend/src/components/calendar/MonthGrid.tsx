"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import AddEventModal from "./add-event/AddEventModal";
import MonthNav from "./MonthNav";
import AddEventButton from "./AddEventButton";
import EditEventModal from "./edit-event/EditEventModal";
import CategoriesPill from "./filters/CategoriesPill";
import CategoriesDropdown from "./filters/CategoriesDropdown";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/* ========== COLOR PALETTE ========== */
const COLORS = {
  coral: "#E07856",
  yellow: "#F4B860",
  purple: "#B8A4D4",
  teal: "#20A39E",
  borderGray: "#DCE0E5",
  textGray: "#23001E",
  lightGray: "#fafafa",
};

type ChecklistItem = { id: string; text: string; done: boolean };

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  color: "coral" | "yellow" | "purple" | "teal";
  meetingLink: string | null;
  agendaItems: ChecklistItem[];
  nextStepsItems: ChecklistItem[];
  files: { name: string }[];
  description?: string;
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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Categories dropdown state + anchoring
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesBtnRef = useRef<HTMLDivElement | null>(null);
  const [categoriesPos, setCategoriesPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

useLayoutEffect(() => {
  if (!isCategoriesOpen) return;

  const el = categoriesBtnRef.current;
  if (!el) return;

  const rect = el.getBoundingClientRect();

  setCategoriesPos({
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  });
}, [isCategoriesOpen]);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  function goToPreviousMonth() {
    setDisplayDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setDisplayDate(new Date(year, month + 1, 1));
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startingDayOfWeek = firstDay === 0 ? 6 : firstDay - 1;
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

  const calendarDays: Date[] = Array.from({ length: totalCells }).map((_, i) => {
    const dayIndex = i - startingDayOfWeek + 1;
    return new Date(year, month, dayIndex);
  });

  const weekRowCount = totalCells / 7; // 5 or 6 rows

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

  const isExpandedCalendar = useMemo(() => {
    for (const d of calendarDays) {
      const count = events.filter((e) => isSameDay(e.start, d)).length;
      if (count >= 3) return true;
    }
    return false;
  }, [events, calendarDays]);

  /* ========= Pills sizing ========= */
  const CELL_PADDING = 6;
  const PILL_HEIGHT = 26;
  const PILL_PADDING_X = 8;
  const PILL_FONT_SIZE = 11;
  const PILL_GAP = 3;

  const TWO_PILLS_H = PILL_HEIGHT * 2 + PILL_GAP;
  const SEE_MORE_H = 14;
  const RESERVED_EVENTS_AREA_H = TWO_PILLS_H;
  const RESERVED_EVENTS_AREA_H_EXPANDED = TWO_PILLS_H + SEE_MORE_H;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div ref={categoriesBtnRef} style={{ position: "relative" }}>
            <CategoriesPill
              onClick={() => setIsCategoriesOpen((v) => !v)}
            />
          </div>

          <AddEventButton onClick={() => setIsAddOpen(true)} />
        </div>

        <div style={{ marginLeft: "auto", marginRight: -2 }}>
          <MonthNav
            label={`${monthNames[month]} ${year}`}
            onPrev={goToPreviousMonth}
            onNext={goToNextMonth}
          />
        </div>
      </div>

      {/* Categories dropdown (anchored under Categories pill) */}
      <CategoriesDropdown
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        anchorPos={categoriesPos}
      />

      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(data) => {
          const [hh, mm] = (data.startTime ?? "09:00").split(":").map(Number);
          const [yyyy, monthStr, dayStr] = data.startDate.split("-").map(Number);

          const start = new Date(yyyy, monthStr - 1, dayStr, hh, mm);

          const newEvent: CalendarEvent = {
            id: crypto.randomUUID(),
            title: data.title,
            start,
            color: data.color,
            meetingLink: null,
            agendaItems: [],
            nextStepsItems: [],
            files: [],
            description: data.description ?? "",
          };

          setEvents((prev) => [...prev, newEvent]);
          setIsAddOpen(false);
        }}
      />

      {/* GRID CONTAINER */}
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
          minHeight: 0,
        }}
      >
        {/* DAY HEADERS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            height: 44,
            flexShrink: 0,
          }}
        >
          {days.map((d) => (
            <div
              key={d}
              style={{
                border: `1px solid ${COLORS.borderGray}`,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                fontSize: 14,
                fontWeight: 500,
                color: "#6F7C8A",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridTemplateRows: `repeat(${weekRowCount}, minmax(0, 1fr))`,
            flex: 1,
            minHeight: 0,
            color: "#14181F",
          }}
        >
          {calendarDays.map((cellDate, i) => {
            const now = new Date();
            const isCurrentDay =
              cellDate.getDate() === now.getDate() &&
              cellDate.getMonth() === now.getMonth() &&
              cellDate.getFullYear() === now.getFullYear();

            const isOtherMonth = cellDate.getMonth() !== month;

            const eventsForThisDay = events
              .filter((e) => isSameDay(e.start, cellDate))
              .sort((a, b) => a.start.getTime() - b.start.getTime());

            const count = eventsForThisDay.length;
            const isExpandedCell = count >= 3;

            return (
              <div
                key={i}
                style={{
                  border: `1px solid ${COLORS.borderGray}`,
                  padding: CELL_PADDING,
                  background: isOtherMonth ? COLORS.lightGray : "#fff",
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
                  {eventsForThisDay.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(ev);
                        setIsEditOpen(true);
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
                        background:
                          ev.color === "coral"
                            ? "rgba(239, 91, 91, 0.85)"
                            : ev.color === "yellow"
                            ? "rgba(255, 186, 73, 1)"
                            : ev.color === "purple"
                            ? "rgba(184, 164, 212, 0.9)"
                            : "rgba(32, 163, 158, 0.9)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                      }}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
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
          })}
        </div>
      </div>

      <EditEventModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSaveEvent={(id, updates) => {
          setEvents((prev) =>
            prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)),
          );

          setSelectedEvent((prev) =>
            prev && prev.id === id ? { ...prev, ...updates } : prev,
          );

          setIsEditOpen(false);
        }}
        onDeleteEvent={(id) => {
          setEvents((prev) => prev.filter((ev) => ev.id !== id));
          setIsEditOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
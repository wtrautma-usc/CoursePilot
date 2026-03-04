"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import AddEventModal from "./add-event/AddEventModal";
import MonthNav from "./MonthNav";
import AddEventButton from "./AddEventButton";
import EditEventModal from "./edit-event/EditEventModal";
import CategoriesPill from "./filters/CategoriesPill";
import CategoriesDropdown from "./filters/CategoriesDropdown";
import DayCell from "./DayCell";

import type { CalendarEvent } from "./types";
import { DAY_LABELS, MONTH_NAMES, CALENDAR_COLORS } from "./constants";
import { isSameDay } from "./util";

type AnchorPos = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export default function MonthGrid() {
  const [displayDate, setDisplayDate] = useState(() => new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesBtnRef = useRef<HTMLDivElement | null>(null);
  const [categoriesPos, setCategoriesPos] = useState<AnchorPos | null>(null);

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

  const calendarDays: Date[] = Array.from({ length: totalCells }).map(
    (_, i) => {
      const dayIndex = i - startingDayOfWeek + 1;
      return new Date(year, month, dayIndex);
    },
  );

  const weekRowCount = totalCells / 7;

  const isExpandedCalendar = useMemo(() => {
    for (const d of calendarDays) {
      const count = events.filter((e) => isSameDay(e.start, d)).length;
      if (count >= 3) return true;
    }
    return false;
  }, [events, calendarDays]);

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
            <CategoriesPill onClick={() => setIsCategoriesOpen((v) => !v)} />
          </div>
          <AddEventButton onClick={() => setIsAddOpen(true)} />
        </div>

        <div style={{ marginLeft: "auto", marginRight: -2 }}>
          <MonthNav
            label={`${MONTH_NAMES[month]} ${year}`}
            onPrev={goToPreviousMonth}
            onNext={goToNextMonth}
          />
        </div>
      </div>

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
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              style={{
                border: `1px solid ${CALENDAR_COLORS.borderGray}`,
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
            const eventsForDay = events
              .filter((e) => isSameDay(e.start, cellDate))
              .sort((a, b) => a.start.getTime() - b.start.getTime());

            return (
              <DayCell
                key={i}
                cellDate={cellDate}
                currentMonth={month}
                events={eventsForDay}
                onEventClick={(ev) => {
                  setSelectedEvent(ev);
                  setIsEditOpen(true);
                }}
              />
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

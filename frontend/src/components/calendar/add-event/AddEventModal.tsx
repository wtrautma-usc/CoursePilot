"use client";

import { useEffect, useState, useRef } from "react";
import EventTitleField from "../fields/EventTitleInput";
import EventDescriptionField from "../fields/EventDescriptionField";
import CloseButton from "@/components/ui/CloseButton";

import type { AddEventModalProps, EventDraft } from "./types";
import { COLORS } from "./constants";
import { isHexColor, resolveColorValue, todayISO } from "./util";

import DateTimeSection from "./components/DateTimeSection";
import ColorPicker from "./components/ColorPicker";
import FooterActions from "./components/FooterActions";

export default function AddEventModal({ isOpen, onClose, onSave }: AddEventModalProps) {
  const [draft, setDraft] = useState<EventDraft>({
    title: "",
    description: "",
    allDay: false,
    startDate: todayISO(),
    startTime: "08:30",
    endDate: todayISO(),
    endTime: "10:30",
    color: "teal",
  });

  const [customColors, setCustomColors] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  function update<K extends keyof EventDraft>(key: K, value: EventDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!draft.title.trim()) {
      alert("Please enter an event name.");
      return;
    }

    onSave({
      ...draft,
      color: isHexColor(draft.color)
        ? draft.color
        : resolveColorValue(draft.color, customColors),
    });

    onClose();
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
    color: "#000",
    fontFamily: "Inter, sans-serif",
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 600,
          maxWidth: "100%",
          borderRadius: 20,
          background: "#fff",
          overflow: "hidden",
          boxShadow: "0 4px 4px 2px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: COLORS.headerBg,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `4px solid ${COLORS.headerBorder}`,
          }}
        >
          <div
            style={{
              color: "#000",
              fontFamily: "Inter, sans-serif",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Add Event
          </div>

          <CloseButton onClick={onClose} />
        </div>

        {/* Body */}
        <div
          style={{
            padding: "24px 50px",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Event Name */}
            <div>
              <label style={labelStyle}>
                Event Name <span style={{ color: "#9F2D00" }}>*</span>
              </label>
              <EventTitleField
                value={draft.title}
                onChange={(v) => update("title", v)}
                label="" // we already render the label above
                required
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <EventDescriptionField
                value={draft.description}
                onChange={(v) => update("description", v)}
                label="" // we already render the label above
              />
            </div>

            {/* All day */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={draft.allDay}
                onChange={(e) => update("allDay", e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "16px",
                  color: "#000",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                All day
              </span>
            </div>

            <DateTimeSection draft={draft} update={update} labelStyle={labelStyle} />

            <ColorPicker
              draft={draft}
              update={update}
              customColors={customColors}
              setCustomColors={setCustomColors}
              labelStyle={labelStyle}
            />

            <FooterActions onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}
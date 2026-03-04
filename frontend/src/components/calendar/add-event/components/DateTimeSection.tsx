"use client";

import type { EventDraft } from "../types";
import Image from "next/image";
import React, { useRef } from "react";

type Props = {
  draft: EventDraft;
  update: <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => void;
  labelStyle: React.CSSProperties;
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #D1D5DB",
  borderRadius: 6,
  padding: "6px 10px",
  background: "#fff",
  position: "relative",
  width: "fit-content",
  cursor: "pointer",
  userSelect: "none",
};

const textStyle: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  color: "#000",
  lineHeight: "16px",
  whiteSpace: "nowrap",
  pointerEvents: "none",
};

const iconStyle: React.CSSProperties = {
  flexShrink: 0,
  pointerEvents: "none",
};

// Hidden input: we don't rely on clicking it; we open via showPicker()
const hiddenInputStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: "none",
};

function formatDateMMDDYYYY(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}/${y}`;
}

function formatTime12h(hhmm: string) {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function openNativePicker(el: HTMLInputElement | null) {
  if (!el) return;

  // Focus is required for some browsers
  el.focus({ preventScroll: true });

  // Chromium: this opens the native picker reliably
  const anyEl = el as any;
  if (typeof anyEl.showPicker === "function") {
    anyEl.showPicker();
    return;
  }

  // Fallback: triggers some pickers
  el.click();
}

export default function DateTimeSection({ draft, update, labelStyle }: Props) {
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Starts */}
      <div>
        <div style={labelStyle}>
          Starts <span style={{ color: "#B23A2B" }}>*</span>
        </div>

        <div style={rowStyle}>
          {/* Start date */}
          <div
            style={pillStyle}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openNativePicker(startDateRef.current);
            }}
          >
            <Image
              src="/Icons/calendar.svg"
              alt="Calendar"
              width={16}
              height={16}
              style={iconStyle}
            />
            <span style={textStyle}>
              {formatDateMMDDYYYY(draft.startDate) || "MM/DD/YYYY"}
            </span>
            <input
              ref={startDateRef}
              type="date"
              value={draft.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              style={hiddenInputStyle}
              aria-label="Start date"
            />
          </div>

          {/* Start time */}
          <div
            style={{
              ...pillStyle,
              cursor: draft.allDay ? "not-allowed" : "pointer",
              opacity: draft.allDay ? 0.6 : 1,
            }}
            onMouseDown={(e) => {
              if (draft.allDay) return;
              e.preventDefault();
              e.stopPropagation();
              openNativePicker(startTimeRef.current);
            }}
          >
            <Image
              src="/Icons/clock.svg"
              alt="Time"
              width={16}
              height={16}
              style={iconStyle}
            />
            <span style={textStyle}>
              {formatTime12h(draft.startTime) || "08:30 AM"}
            </span>
            <input
              ref={startTimeRef}
              type="time"
              value={draft.startTime}
              onChange={(e) => update("startTime", e.target.value)}
              disabled={draft.allDay}
              style={hiddenInputStyle}
              aria-label="Start time"
            />
          </div>
        </div>
      </div>

      {/* Ends */}
      <div>
        <div style={labelStyle}>
          Ends <span style={{ color: "#B23A2B" }}>*</span>
        </div>

        <div style={rowStyle}>
          {/* End date */}
          <div
            style={pillStyle}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openNativePicker(endDateRef.current);
            }}
          >
            <Image
              src="/Icons/calendar.svg"
              alt="Calendar"
              width={16}
              height={16}
              style={iconStyle}
            />
            <span style={textStyle}>
              {formatDateMMDDYYYY(draft.endDate) || "MM/DD/YYYY"}
            </span>
            <input
              ref={endDateRef}
              type="date"
              value={draft.endDate}
              onChange={(e) => update("endDate", e.target.value)}
              style={hiddenInputStyle}
              aria-label="End date"
            />
          </div>

          {/* End time */}
          <div
            style={{
              ...pillStyle,
              cursor: draft.allDay ? "not-allowed" : "pointer",
              opacity: draft.allDay ? 0.6 : 1,
            }}
            onMouseDown={(e) => {
              if (draft.allDay) return;
              e.preventDefault();
              e.stopPropagation();
              openNativePicker(endTimeRef.current);
            }}
          >
            <Image
              src="/Icons/clock.svg"
              alt="Time"
              width={16}
              height={16}
              style={iconStyle}
            />
            <span style={textStyle}>
              {formatTime12h(draft.endTime) || "10:30 AM"}
            </span>
            <input
              ref={endTimeRef}
              type="time"
              value={draft.endTime}
              onChange={(e) => update("endTime", e.target.value)}
              disabled={draft.allDay}
              style={hiddenInputStyle}
              aria-label="End time"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
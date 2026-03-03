"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import EventTitleField from "./fields/EventTitleField";
import EventDescriptionField from "./fields/EventDescriptionField";

type EventDraft = {
  title: string;
  description: string;
  allDay: boolean;
  startDate: string; // yyyy-mm-dd
  startTime: string; // hh:mm
  endDate: string; // yyyy-mm-dd
  endTime: string; // hh:mm
  color: string; // "teal" | "yellow" | "pink" | "green" | "#RRGGBB"
};

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventDraft) => void;
  
};

const COLORS = {
  headerBg: "#CFE9E7",
  headerBorder: "#5FAEA8",
  teal: "#20A39E",
  yellow: "#F4B860",
  pink: "#E7A3D6",
  green: "#7CB342",
  text: "#111",
  subText: "#555",
  inputBg: "#EDF0F2",
  inputBorder: "#DCE0E5",
};

const DATEPILL = {
  radius: 8,
  border: "1px solid #DCE0E5",
  bg: "#EDF0F2",
  padY: 10,
  padX: 10,
  gap: 6,
};
const PRESET_COLORS = [
  { key: "teal", color: COLORS.teal },
  { key: "yellow", color: COLORS.yellow },
  { key: "pink", color: COLORS.pink },
  { key: "green", color: COLORS.green },
] as const;

function isHexColor(v: string) {
  return /^#([0-9a-fA-F]{6})$/.test(v);
}

function normalizeHex(v: string) {
  let s = v.trim();
  if (!s) return "#000000";
  if (!s.startsWith("#")) s = "#" + s;
  s = s.toUpperCase();

  // allow 3-digit (#ABC) -> #AABBCC
  const m3 = s.match(/^#([0-9A-F]{3})$/);
  if (m3) {
    const [a, b, c] = m3[1].split("");
    return `#${a}${a}${b}${b}${c}${c}`;
  }

  if (isHexColor(s)) return s;
  return "#000000";
}

function resolveColorValue(selected: string, customColors: string[]) {
  const preset = PRESET_COLORS.find((p) => p.key === selected);
  if (preset) return preset.color;
  if (customColors.includes(selected) && isHexColor(selected)) return selected;
  return COLORS.teal;
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// --- formatting helpers (so the pills match your Figma text) ---
const pad2 = (n: number) => String(n).padStart(2, "0");

function formatDateMMDDYYYY(yyyyMmDd: string) {
  if (!yyyyMmDd) return "";
  const parts = yyyyMmDd.split("-");
  if (parts.length !== 3) return "";
  const [y, m, d] = parts;
  if (!y || !m || !d) return "";
  return `${m}/${d}/${y}`;
}

function formatTime12h(hhMm: string) {
  if (!hhMm) return "";
  const parts = hhMm.split(":");
  if (parts.length < 2) return "";
  const hNum = Number(parts[0]);
  const mNum = Number(parts[1]);
  if (Number.isNaN(hNum) || Number.isNaN(mNum)) return "";

  const ampm = hNum >= 12 ? "PM" : "AM";
  let h = hNum % 12;
  if (h === 0) h = 12;
  return `${pad2(h)}:${pad2(mNum)} ${ampm}`;
}

type PickerPillProps = {
  icon: ReactNode;
  valueLabel: string;
  disabled?: boolean;
  inputType: "date" | "time";
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  inputAriaLabel: string;
};

function PickerPill({
  icon,
  valueLabel,
  disabled = false,
  inputType,
  value,
  onChange,
  inputAriaLabel,
}: PickerPillProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openNativePicker = () => {
    if (disabled) return;
    const el = inputRef.current;
    if (!el) return;

    // @ts-expect-error showPicker not in all TS DOM libs
    if (typeof el.showPicker === "function") {
      // @ts-expect-error showPicker not in all TS DOM libs
      el.showPicker();
      return;
    }

    el.focus();
    el.click();
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={inputAriaLabel}
      aria-disabled={disabled}
      onClick={openNativePicker}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openNativePicker();
        }
      }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: DATEPILL.gap,
        padding: `${DATEPILL.padY}px ${DATEPILL.padX}px`,
        borderRadius: DATEPILL.radius,
        border: DATEPILL.border,
        background: disabled ? "#F5F6F7" : DATEPILL.bg,
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 14, lineHeight: "14px" }}>{icon}</span>

      <span
        style={{
          fontSize: 12,
          fontWeight: 400,
          lineHeight: "16px",
          color: "#000",
          whiteSpace: "nowrap",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {valueLabel}
      </span>

      <input
        ref={inputRef}
        aria-label={inputAriaLabel}
        type={inputType}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
    </div>
  );
}

export default function AddEventModal({
  isOpen,
  onClose,
  onSave,
}: AddEventModalProps) {
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
  const [isColorPopoverOpen, setIsColorPopoverOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState("#20A39E"); // default
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isColorPopoverOpen) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const el = popoverRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsColorPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isColorPopoverOpen]);

  if (!isOpen) return null;

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
  function addCustomColor(hex: string) {
    const normalized = normalizeHex(hex);

    // avoid duplicates
    setCustomColors((prev) => {
      if (prev.includes(normalized)) return prev;
      return [...prev, normalized];
    });

    // select it
    update("color", normalized);
    setIsColorPopoverOpen(false);
  }

  // shared label style (keeps spacing consistent)
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6, // label-to-control = 6 (tight, like Figma)
    color: "#000",
    fontFamily: "Inter, sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 32,
    fontSize: 12,
    fontWeight: 500,
    padding: "6px 10px",
    borderRadius: 4,
    border: `1px solid ${COLORS.inputBorder}`,
    background: COLORS.inputBg,
    outline: "none",
    color: "#000",
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
  };

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
      {/* Modal Card */}
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
              lineHeight: "normal",
              textTransform: "capitalize",
              flex: "1 0 0",
            }}
          >
            Add Event
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              lineHeight: 0,
              padding: 6,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.3002 5.70997C17.9102 5.31997 17.2802 5.31997 16.8902 5.70997L12 10.6002L7.11021 5.70997C6.72021 5.31997 6.09021 5.31997 5.70021 5.70997C5.31021 6.09997 5.31021 6.72997 5.70021 7.11997L10.5902 12L5.70021 16.89C5.31021 17.28 5.31021 17.91 5.70021 18.3C6.09021 18.69 6.72021 18.69 7.11021 18.3L12 13.41L16.8902 18.3C17.2802 18.69 17.9102 18.69 18.3002 18.3C18.6902 17.91 18.6902 17.28 18.3002 16.89L13.4102 12L18.3002 7.11997C18.6902 6.72997 18.6902 6.09997 18.3002 5.70997Z" />
            </svg>
          </button>
        </div>

        {/* Body — matches Figma padding + 10px vertical rhythm */}
        <div
          style={{
            padding: "24px 50px", // ✅ Figma: top/bottom 24, left/right 50
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
              <input
                value={draft.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Class meeting"
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={draft.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="CSCI 577A frontend meeting"
                style={{
                  ...inputStyle,
                  height: 64,
                  resize: "none",
                }}
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

            {/* Starts / Ends */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {/* Starts */}
              <div>
                <div style={labelStyle}>
                  Starts <span style={{ color: "#B23A2B" }}>*</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <PickerPill
                    icon="📅"
                    inputType="date"
                    value={draft.startDate}
                    valueLabel={
                      formatDateMMDDYYYY(draft.startDate) || "MM/DD/YYYY"
                    }
                    onChange={(e) => update("startDate", e.target.value)}
                    inputAriaLabel="Start date"
                  />

                  <PickerPill
                    icon="🕒"
                    inputType="time"
                    value={draft.startTime}
                    valueLabel={formatTime12h(draft.startTime) || "08:30 AM"}
                    onChange={(e) => update("startTime", e.target.value)}
                    disabled={draft.allDay}
                    inputAriaLabel="Start time"
                  />
                </div>
              </div>

              {/* Ends */}
              <div>
                <div style={labelStyle}>
                  Ends <span style={{ color: "#B23A2B" }}>*</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <PickerPill
                    icon="📅"
                    inputType="date"
                    value={draft.endDate}
                    valueLabel={
                      formatDateMMDDYYYY(draft.endDate) || "MM/DD/YYYY"
                    }
                    onChange={(e) => update("endDate", e.target.value)}
                    inputAriaLabel="End date"
                  />

                  <PickerPill
                    icon="🕒"
                    inputType="time"
                    value={draft.endTime}
                    valueLabel={formatTime12h(draft.endTime) || "10:30 PM"}
                    onChange={(e) => update("endTime", e.target.value)}
                    disabled={draft.allDay}
                    inputAriaLabel="End time"
                  />
                </div>
              </div>
            </div>

            {/* Color */}
            <div>
              <div style={labelStyle}>
                Color <span style={{ color: "#B23A2B" }}>*</span>
              </div>

              <div style={{ position: "relative", width: "fit-content" }}>
                {/* Figma-style color pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: 7,
                    borderRadius: 4,
                    border: `1px solid ${COLORS.inputBorder}`,
                    background: DATEPILL.bg,
                  }}
                >
                  {/* Presets */}
                  {PRESET_COLORS.map((c) => {
                    const selected = draft.color === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => update("color", c.key)}
                        aria-label={`Select ${c.key} color`}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          background: c.color,
                          border: "1px solid rgba(0,0,0,0.12)",
                          padding: 0,
                          cursor: "pointer",
                          outline: selected
                            ? "2px solid rgba(0,0,0,0.55)"
                            : "none",
                          outlineOffset: 2,
                        }}
                      />
                    );
                  })}

                  {/* Custom colors */}
                  {customColors.map((hex) => {
                    const selected = draft.color === hex;
                    return (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => update("color", hex)}
                        aria-label={`Select custom color ${hex}`}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          background: hex,
                          border: "1px solid rgba(0,0,0,0.12)",
                          padding: 0,
                          cursor: "pointer",
                          outline: selected
                            ? "2px solid rgba(0,0,0,0.55)"
                            : "none",
                          outlineOffset: 2,
                        }}
                      />
                    );
                  })}

                  {/* Plus */}
                  <button
                    type="button"
                    aria-label="Add custom color"
                    onClick={() => {
                      setCustomHexInput(
                        isHexColor(draft.color) ? draft.color : "#20A39E",
                      );
                      setIsColorPopoverOpen((v) => !v);
                    }}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      background: "transparent",
                      border: "1px solid rgba(0,0,0,0.25)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 0,
                      color: "#000",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Popover */}
                {isColorPopoverOpen && (
                  <div
                    ref={popoverRef}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "calc(100% + 8px)",
                      top: "50%",
                      left: "calc(100% + 8px)",
                      transform: "translateY(-50%)",
                      zIndex: 50,
                      width: 220,
                      padding: 12,
                      borderRadius: 10,
                      border: `1px solid ${COLORS.inputBorder}`,
                      background: "#fff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 8,
                        color: "#000",
                      }}
                    >
                      Custom color
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      {/* Native color picker */}
                      <input
                        type="color"
                        value={normalizeHex(customHexInput)}
                        onChange={(e) =>
                          setCustomHexInput(e.target.value.toUpperCase())
                        }
                        style={{
                          width: 36,
                          height: 32,
                          padding: 0,
                          border: `1px solid ${COLORS.inputBorder}`,
                          borderRadius: 6,
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      />

                      {/* Hex input */}
                      <input
                        value={customHexInput}
                        onChange={(e) => setCustomHexInput(e.target.value)}
                        placeholder="#RRGGBB"
                        style={{
                          flex: 1,
                          height: 32,
                          borderRadius: 6,
                          border: `1px solid ${COLORS.inputBorder}`,
                          background: COLORS.inputBg,
                          padding: "0 10px",
                          fontSize: 12,
                          outline: "none",
                          color: "#000",
                          fontFamily: "Inter, sans-serif",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setIsColorPopoverOpen(false)}
                        style={{
                          height: 30,
                          padding: "0 10px",
                          borderRadius: 8,
                          border: `1px solid ${COLORS.inputBorder}`,
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => addCustomColor(customHexInput)}
                        style={{
                          height: 30,
                          padding: "0 10px",
                          borderRadius: 8,
                          border: "none",
                          background: COLORS.teal,
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSave}
                style={{
                  background: COLORS.teal,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 8px rgba(32,163,158,0.35)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

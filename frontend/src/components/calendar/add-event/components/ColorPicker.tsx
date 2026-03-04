"use client";

import { useEffect, useRef, useState } from "react";
import type { EventDraft } from "../types";
import { COLORS, DATEPILL, PRESET_COLORS } from "../constants";
import { isHexColor, normalizeHex } from "../util";

type Props = {
  draft: EventDraft;
  update: <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => void;
  customColors: string[];
  setCustomColors: React.Dispatch<React.SetStateAction<string[]>>;
  labelStyle: React.CSSProperties;
};

export default function ColorPicker({
  draft,
  update,
  customColors,
  setCustomColors,
  labelStyle,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState("#20A39E");
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const el = popoverRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isOpen]);

  function addCustomColor(hex: string) {
    const normalized = normalizeHex(hex);

    setCustomColors((prev) => {
      if (prev.includes(normalized)) return prev;
      return [...prev, normalized];
    });

    update("color", normalized);
    setIsOpen(false);
  }

  return (
    <div>
      <div style={labelStyle}>
        Color <span style={{ color: "#B23A2B" }}>*</span>
      </div>

      <div style={{ position: "relative", width: "fit-content" }}>
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
                  outline: selected ? "2px solid rgba(0,0,0,0.55)" : "none",
                  outlineOffset: 2,
                }}
              />
            );
          })}

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
                  outline: selected ? "2px solid rgba(0,0,0,0.55)" : "none",
                  outlineOffset: 2,
                }}
              />
            );
          })}

          <button
            type="button"
            aria-label="Add custom color"
            onClick={() => {
              setCustomHexInput(isHexColor(draft.color) ? draft.color : "#20A39E");
              setIsOpen((v) => !v);
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

        {isOpen && (
          <div
            ref={popoverRef}
            style={{
              position: "absolute",
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
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "#000" }}>
              Custom color
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <input
                type="color"
                value={normalizeHex(customHexInput)}
                onChange={(e) => setCustomHexInput(e.target.value.toUpperCase())}
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

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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
  );
}
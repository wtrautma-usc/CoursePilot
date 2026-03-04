"use client";

import React from "react";
import CategoriesPill from "./filters/CategoriesPill";

type MonthNavProps = {
  label: string; // e.g. "FEBRUARY 2026"
  onPrev: () => void;
  onNext: () => void;
};

export default function MonthNav({ label, onPrev, onNext }: MonthNavProps) {
  const navBtnStyle: React.CSSProperties = {
    width: 41,
    height: 41,
    borderRadius: 10,
    background: "#D9D9D9", // Figma grey
    border: "none",
    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  };

  const monthPillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px 24px",
    borderRadius: 40,
    background: "#fff",
    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
    border: "none",
    fontFamily: "Inter, sans-serif",
    fontSize: 20,
    fontWeight: 600,
    lineHeight: "24px",
    color: "#000",
    whiteSpace: "nowrap",
  };

  function Chevron({ dir }: { dir: "left" | "right" }) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={dir === "left" ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18"}
          stroke="#9B9B9B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <button type="button" onClick={onPrev} aria-label="Previous month" style={navBtnStyle}>
        <Chevron dir="left" />
      </button>

      <div style={monthPillStyle}>{label}</div>

      <button type="button" onClick={onNext} aria-label="Next month" style={navBtnStyle}>
        <Chevron dir="right" />
      </button>
    </div>
  );
}
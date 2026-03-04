"use client";

import React from "react";

type Props = {
  label?: string; // default "Categories"
  onClick?: () => void;
};

export default function CategoriesPill({ label = "Categories", onClick }: Props) {
  const pillStyle: React.CSSProperties = {
    height: 44,
    borderRadius: 12,
    background: "#FFFFFF",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "0 18px",
    fontFamily: "Inter, sans-serif",
    fontSize: 20,
    fontWeight: 600,
    color: "#000",
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <button type="button" onClick={onClick} style={pillStyle}>
      <span style={{ lineHeight: "24px" }}>{label}</span>

      {/* caret */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 10L12 15L17 10"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
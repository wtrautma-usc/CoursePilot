"use client";

import React from "react";

type AddRowProps = {
  label: string;              // "Add item" / "Add file"
  onClick?: () => void;       // optional for later
  style?: React.CSSProperties;
};

export default function AddRow({ label, onClick, style }: AddRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "5px 0 4px",
        border: "none",
        background: "transparent",
        cursor: onClick ? "pointer" : "default",
        color: "#A4A9AD",
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
        fontWeight: 400,
        lineHeight: "16px",
        textAlign: "left",
        ...style,
      }}
    >
      {/* Plus icon box (Figma-ish) */}
      <span
        aria-hidden
        style={{
          width: 18,
          height: 18,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          color: "#A4A9AD",
          fontSize: 18,
          lineHeight: "18px",
          transform: "translateY(-1px)",
          flex: "0 0 auto",
        }}
      >
        +
      </span>

      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}
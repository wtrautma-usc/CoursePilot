"use client";

import { COLORS } from "../constants";

type Props = {
  onSave: () => void;
};

export default function FooterActions({ onSave }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        onClick={onSave}
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
  );
}
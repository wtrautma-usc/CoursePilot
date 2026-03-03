"use client";

import React from "react";

type DoneButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export default function DoneButton({
  onClick,
  disabled = false,
  label = "Done",
}: DoneButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        background: disabled ? "#9CA3AF" : "#20A39E",
        color: "#fff",
        borderRadius: 8,
        padding: "8px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "Inter, sans-serif",
        opacity: disabled ? 0.7 : 1,
        transition: "background 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}
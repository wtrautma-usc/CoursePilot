"use client";

import React from "react";

type CancelButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export default function CancelButton({
  onClick,
  disabled = false,
  label = "Cancel",
}: CancelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid #DCE0E5",
        background: "#fff",
        color: "#374151",
        borderRadius: 8,
        padding: "8px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "Inter, sans-serif",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}
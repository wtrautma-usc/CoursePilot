"use client";

import React from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
};

export default function SaveButton({
  onClick,
  disabled = false,
  label = "Save",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        background: "#20A39E",
        color: "#ffffff",
        borderRadius: 10,
        padding: "10px 16px",
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}
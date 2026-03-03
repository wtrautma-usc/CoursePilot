"use client";

import React from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
};

export default function DeleteButton({
  onClick,
  disabled = false,
  label = "Delete",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "1px solid #ef4444",
        color: "#ef4444",
        background: "#ffffff",
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
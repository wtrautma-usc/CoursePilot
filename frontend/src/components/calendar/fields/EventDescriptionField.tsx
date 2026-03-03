"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  placeholder?: string;
  rowsHeight?: number; // px
};

export default function EventDescriptionField({
  value,
  onChange,
  label = "Description",
  placeholder = "CSCI 577A frontend meeting",
  rowsHeight = 64,
}: Props) {
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
    color: "#000",
    fontFamily: "Inter, sans-serif",
  };

  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    height: 32,
    fontSize: 12,
    fontWeight: 500,
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #DCE0E5",
    background: "#EDF0F2",
    outline: "none",
    color: "#000",
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...baseInputStyle,
          height: rowsHeight,
          resize: "none",
        }}
      />
    </div>
  );
}
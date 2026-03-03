"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
};

export default function EventTitleField({
  value,
  onChange,
  label = "Event Name",
  required = false,
  placeholder = "Class meeting",
  autoFocus = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [autoFocus]);

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
    color: "#000",
    fontFamily: "Inter, sans-serif",
  };

  const inputStyle: React.CSSProperties = {
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
      <label style={labelStyle}>
        {label}{" "}
        {required ? <span style={{ color: "#9F2D00" }}>*</span> : null}
      </label>

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}
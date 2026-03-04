"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function EventTitleInput({
  value,
  onChange,
  inputRef,
  onKeyDown,
  placeholder = "Event name",
}: Props) {
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      aria-label="Edit event title"
      placeholder={placeholder}
      style={{
        width: "100%",
        height: 34,
        fontSize: 12,
        fontWeight: 500,
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #DCE0E5",
        background: "#EDF0F2",
        outline: "none",
        color: "#000",
        boxSizing: "border-box",
        fontFamily: "Inter, sans-serif",
      }}
    />
  );
}
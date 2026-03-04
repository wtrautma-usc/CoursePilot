"use client";

import React from "react";

type EventDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function EventDescriptionField({
  value,
  onChange,
  placeholder = "Add description",
  inputRef,
  onKeyDown,
}: EventDescriptionFieldProps) {
  return (
    <textarea
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      style={{
        width: "100%",
        minHeight: 64,
        resize: "vertical",
        fontSize: 12,
        color: "#000000",
        background: "#EDF0F2",
        border: "1px solid #DCE0E5",
        borderRadius: 6,
        padding: "8px 10px",
        outline: "none",
        fontFamily: "Inter, sans-serif",
        boxSizing: "border-box",
      }}
    />
  );
}
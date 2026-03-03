"use client";

import React, { useEffect, useRef, useState } from "react";

type ChecklistRowProps = {
  id: string;
  text: string;
  done: boolean;
  placeholder?: string;
  autoFocus?: boolean;

  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onChangeText: (id: string, text: string) => void;

  // Called when user "finishes" typing (blur / enter)
  onCommit?: (id: string) => void;
};

export default function ChecklistRow({
  id,
  text,
  done,
  placeholder = "Type here",
  autoFocus,
  onToggle,
  onChangeText,
  onCommit,
  onDelete,
}: ChecklistRowProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Reliable hover (no CSS selector issues)
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Editing mode:
  // - If text is empty, it should be editable (new row)
  // - Once the user enters text + commits, it becomes locked (not editable)
  const [isEditing, setIsEditing] = useState(() => text.trim().length === 0);

  // Keep editing state in sync if parent changes text (rare, but safe)
  useEffect(() => {
    if (text.trim().length === 0) setIsEditing(true);
  }, [text]);

  // Auto-focus new row
  useEffect(() => {
    if (autoFocus && isEditing) inputRef.current?.focus();
  }, [autoFocus, isEditing]);

  function commit() {
    // If they typed something, lock it
    if (text.trim().length > 0) setIsEditing(false);
    onCommit?.(id);
  }

  const isEmpty = text.trim().length === 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "5px 0 4px",
      }}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-label={done ? "Mark as incomplete" : "Mark as complete"}
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: `1.5px solid ${done ? "#20A39E" : "#A4A9AD"}`, // ✅ teal border when checked
          background: done ? "#20A39E" : "#fff",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        {done ? (
          <span style={{ color: "#fff", fontSize: 12, lineHeight: "14px" }}>
            ✓
          </span>
        ) : null}
      </button>

      {/* Text: editable only when new / empty */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => onChangeText(id, e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          placeholder={placeholder}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            lineHeight: "24px",
            color: isEmpty ? "#A4A9AD" : "#000000",
            fontStyle: isEmpty ? "italic" : "normal",
          }}
        />
      ) : (
        // ✅ Locked text (not editable, normal cursor)
        <div
          style={{
            width: "100%",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            lineHeight: "24px",
            color: "#000000",
            cursor: "default", // ✅ no I-beam
            userSelect: "text",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      )}

      {/* Delete button (shows only on hover) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        aria-label="Delete item"
        title="Delete"
        style={{
          marginLeft: "auto",
          width: 18,
          height: 18,
          borderRadius: 6,
          border: "none",
          background: "transparent",
          color: "#A4A9AD",
          cursor: "pointer",
          lineHeight: "18px",
          fontSize: 16,

          // ✅ controlled by React hover state (reliable)
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? "auto" : "none",
          transition: "opacity 0.15s ease",
        }}
      >
        ×
      </button>
    </div>
  );
}
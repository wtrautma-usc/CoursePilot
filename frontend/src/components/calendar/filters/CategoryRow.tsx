"use client";

import React from "react";

export type Category = {
  id: string;
  name: string;
  color: string;
  selected: boolean;
};

type Props = {
  category: Category;
  onToggleSelected: (id: string) => void;
  onChangeName: (id: string, name: string) => void;
  onChangeColor: (id: string, color: string) => void;
  onRemove: (id: string) => void;
};

export default function CategoryRow({
  category,
  onToggleSelected,
  onChangeName,
  onChangeColor,
  onRemove,
}: Props) {
  const [isEditing, setIsEditing] = React.useState(category.name.trim() === "");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const row: React.CSSProperties = {
    height: 44,
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "#fff",
  };

  const leftSide: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  };

  const checkSlot: React.CSSProperties = {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: "1.5px solid #D1D5DB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    userSelect: "none",
    background: category.selected ? "#20A39E" : "#fff",
    transition: "all 120ms ease",
  };

  const nameWrap: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    alignItems: "center",
  };

  const placeholderText: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 400,
    color: "#9CA3AF",
    fontStyle: "italic",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "text",
  };

  const nameText: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: "text",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    fontWeight: 500,
    fontStyle: "normal",
    color: "#111827",
    fontFamily: "Inter, sans-serif",
    minWidth: 0,
  };

  const colorBtn: React.CSSProperties = {
    width: 22,
    height: 22,
    borderRadius: 999,
    border: "1px solid #D1D5DB",
    background: category.color,
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.9)",
    cursor: "pointer",
    flexShrink: 0,
  };

  function commitOrRemove() {
    const trimmed = category.name.trim();
    if (!trimmed) {
      onRemove(category.id);
      return;
    }
    setIsEditing(false);
  }

  return (
    <div style={row}>
      <div style={leftSide}>
        {/* Checkbox */}
        <div
          role="button"
          aria-label={category.selected ? "Unselect category" : "Select category"}
          onClick={() => onToggleSelected(category.id)}
          style={checkSlot}
          title={category.selected ? "Selected" : "Not selected"}
        >
          {category.selected ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </div>

        {/* Name / placeholder */}
        <div style={nameWrap} onClick={() => setIsEditing(true)}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={category.name}
              placeholder="Type category here"
              onChange={(e) => onChangeName(category.id, e.target.value)}
              className="category-input"
              onBlur={commitOrRemove}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") commitOrRemove();
              }}
              style={inputStyle}
              aria-label="Category name"
            />
          ) : category.name.trim() === "" ? (
            <span style={placeholderText}>Type category name here</span>
          ) : (
            <span style={nameText} title={category.name}>
              {category.name}
            </span>
          )}
        </div>
      </div>

      {/* Color button */}
      <button
        type="button"
        aria-label="Pick category color"
        style={colorBtn}
        onClick={(e) => {
          e.stopPropagation();
          const options = ["#20A39E", "#E07856", "#F4B860", "#B8A4D4", "#111827"];
          const idx = options.indexOf(category.color);
          const next = options[(idx + 1) % options.length] ?? options[0];
          onChangeColor(category.id, next);
        }}
      />
    </div>
  );
}
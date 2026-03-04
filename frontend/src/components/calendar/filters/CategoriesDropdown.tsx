"use client";

import React from "react";
import CategoryRow, { type Category } from "./CategoryRow";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  anchorPos: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
};

export default function CategoriesDropdown({
  isOpen,
  onClose,
  anchorPos,
}: Props) {
  const [categories, setCategories] = React.useState<Category[]>([]);

  if (!isOpen || !anchorPos) return null;

  // anchorPos is viewport coords from getBoundingClientRect()
  // Convert to page coords so it's correct even if the page scrolls.
  const pageTop = anchorPos.top + window.scrollY;
  const pageLeft = anchorPos.left + window.scrollX;

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
  };

  // ✅ fixed width (won't grow with long names)
  const menuWidth = 260;

  const menu: React.CSSProperties = {
    position: "absolute",
    top: pageTop + anchorPos.height - 1, // ✅ touches pill
    left: pageLeft,
    width: menuWidth,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderTop: "none",
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
  };

  const addRow: React.CSSProperties = {
    height: 44,
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    background: "#fff",
    border: "none",
    width: "100%",
    textAlign: "left",
  };

  const plusBox: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    lineHeight: "18px",
    color: "#111827",
    flexShrink: 0,
    transform: "translateY(-2px)",
  };

  const addLabel: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  function handleAddCategory() {
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: "",
      color: "#20A39E",
      selected: false,
    };

    setCategories((prev) => [newCat, ...prev]);
  }

  function toggleSelected(id: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)),
    );
  }

  function changeName(id: string, name: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );
  }

  function changeColor(id: string, color: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, color } : c)),
    );
  }

  // ✅ NEW: used by CategoryRow when user clicks away and name is empty
  function removeCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function removeEmptyCategories() {
    setCategories((prev) => prev.filter((c) => c.name.trim() !== ""));
  }

  function closeDropdown() {
    removeEmptyCategories();
    onClose();
  }

  return (
    <div
      style={overlay}
      onClick={closeDropdown}
      aria-label="Close categories menu"
    >
      <div style={menu} onClick={(e) => e.stopPropagation()}>
        {/* Category rows (added items appear above) */}
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            onToggleSelected={toggleSelected}
            onChangeName={changeName}
            onChangeColor={changeColor}
            onRemove={removeCategory} // ✅ FIX: pass it in
          />
        ))}

        {/* Add category row (no color button here) */}
        <button type="button" onClick={handleAddCategory} style={addRow}>
          <span style={plusBox}>+</span>
          <span style={addLabel} title="Add category">
            Add category
          </span>
        </button>
      </div>
    </div>
  );
}
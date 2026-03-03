"use client";

type ViewMode = "month" | "week";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
};

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  const isMonth = value === "month";
  const isWeek = value === "week";

  const baseBtnStyle: React.CSSProperties = {
    height: 42,
    borderRadius: 40,
    padding: "0 20px",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    fontSize: 20,
    fontWeight: 600,
    textTransform: "capitalize",
    border: "1px solid transparent",
    background: "transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const selectedStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #B6C1CA",
    color: "#14181F",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  };

  const unselectedStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid transparent",
    color: "#525E6F",
  };

  return (
    <div
      role="tablist"
      aria-label="Calendar view"
      style={{
        height: 44,
        display: "inline-flex",
        alignItems: "center",
        background: "#EDF0F2",
        borderRadius: 40,
        padding: "1px",
        gap: 1,
        boxShadow: "0 4px 4px rgba(0,0,0,0.08)",
      }}
    >
      <button
        type="button"
        role="tab"
        aria-selected={isMonth}
        onClick={() => onChange("month")}
        style={{
          ...baseBtnStyle,
          ...(isMonth ? selectedStyle : unselectedStyle),
        }}
      >
        Month
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={isWeek}
        onClick={() => onChange("week")}
        style={{
          ...baseBtnStyle,
          ...(isWeek ? selectedStyle : unselectedStyle),
        }}
      >
        Week
      </button>
    </div>
  );
}
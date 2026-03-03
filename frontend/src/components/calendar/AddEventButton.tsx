"use client";

type Props = {
  onClick: () => void;
};

export default function AddEventButton({ onClick }: Props) {
  return (
    <button
      type="button"
      aria-label="Add event"
      onClick={onClick}
      style={{
        width: 41,
        height: 41,
        borderRadius: 10,
        background: "#20A39E", // teal
        border: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontSize: 34,
          lineHeight: "34px",
          fontWeight: 300,
          transform: "translateY(-1px)",
          userSelect: "none",
        }}
      >
        +
      </span>
    </button>
  );
}
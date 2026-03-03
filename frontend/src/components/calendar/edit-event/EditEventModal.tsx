"use client";

import React from "react";
import Section from "./Section";
import Divider from "./Divider";
import Image from "next/image";

type EditEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    start: Date;
    end?: Date;
    color?: string;
    description?: string;
  } | null;
};

/**
 * Formats a time range like: "8:30 PM - 9:30 PM"
 */
function formatTimeRange(start: Date, end?: Date) {
  const startLabel = start.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (!end) return startLabel;

  const endLabel = end.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startLabel} - ${endLabel}`;
}

/**
 * Formats date like: "March 3"
 */
function formatDateLabel(d: Date) {
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
}

export default function EditEventModal({
  isOpen,
  onClose,
  event,
}: EditEventModalProps) {
  if (!isOpen || !event) return null;

  const agendaItems: string[] = [];
  const nextSteps: string[] = [];
  const files: { name: string }[] = [];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 550,
          maxWidth: "100%",
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "rgba(32, 163, 158, 0.22)",
            borderBottom: "2px solid #20A39E",
            padding: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#000000",
            }}
          >
            Edit Event
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              fontSize: 22,
              cursor: "pointer",
              lineHeight: "22px",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 50px" }}>
          {/* ✅ Event Details with horizontal line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#000000",
              }}
            >
              Event Details
            </div>

            {/* Line that stretches */}
            <div
              style={{
                flex: 1,
                height: 1,
                background: "#A4A9AD",
              }}
            />
          </div>

          {/* Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 500, color: "#000000" }}>
              {event.title || "Untitled event"}
            </div>

            <button
              type="button"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
              }}
              title="Edit title (later)"
            >
              ✎
            </button>
          </div>

          {/* Time + Date */}
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              marginBottom: 14,
              color: "#111827",
              fontSize: 13,
            }}
          >
            {/* Clock */}
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Image
                src="/icons/clock.svg"
                alt="Time"
                width={16}
                height={16}
                style={{ display: "block", marginTop: -2 }}
              />
              {formatTimeRange(event.start, event.end)}
            </span>

            {/* Calendar */}
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Image
                src="/icons/calendar.svg"
                alt="Date"
                width={16}
                height={16}
                style={{ display: "block", marginTop: -1 }}
              />
              {formatDateLabel(event.start)}
            </span>
          </div>

          {/* Join meeting button */}
          <button
            type="button"
            style={{
              border: "1px solid #e5e7eb",
              background: "#f3f4f6",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 12,
              cursor: "not-allowed",
              opacity: 0.7,
              marginBottom: 18,
            }}
            disabled
          >
            Join meeting
          </button>

          <Divider />

          <Section
            title="Agenda"
            emptyText="No agenda yet"
            items={agendaItems}
          />

          <Divider />

          <Section
            title="Next Steps"
            emptyText="No next steps yet"
            items={nextSteps}
          />

          <Divider />

          {/* Files */}
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            Files
          </div>

          {files.length === 0 ? (
            <div style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 12 }}>
              No files yet
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {files.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "#f3f4f6",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 12,
                  }}
                >
                  {f.name}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 18,
            }}
          >
            <button
              type="button"
              style={{
                border: "1px solid #ef4444",
                color: "#ef4444",
                background: "#fff",
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "not-allowed",
                opacity: 0.7,
              }}
              disabled
            >
              Delete Event
            </button>

            <button
              type="button"
              style={{
                border: "none",
                color: "#fff",
                background: "#20a39f",
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "not-allowed",
                opacity: 1,
              }}
              disabled
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

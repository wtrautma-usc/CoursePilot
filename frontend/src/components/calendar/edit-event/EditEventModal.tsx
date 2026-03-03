"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import AddRow from "./AddRow";
import ChecklistRow from "./ChecklistRow";

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

type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

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

function formatDateLabel(d: Date) {
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
}

function HeadingWithLine({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "15px 0 8px",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "#000000" }}>
        {title}
      </div>
      <div style={{ flex: 1, height: 1, background: "#A4A9AD" }} />
    </div>
  );
}

export default function EditEventModal({ isOpen, onClose, event }: EditEventModalProps) {
  /**
   * IMPORTANT:
   * Do NOT early-return before hooks. That can cause React internal errors.
   * We render null at the bottom instead.
   */

  const [agendaItems, setAgendaItems] = useState<ChecklistItem[]>([]);
  const [nextStepsItems, setNextStepsItems] = useState<ChecklistItem[]>([]);
  const [files, setFiles] = useState<{ name: string }[]>([]);

  const [agendaAutoFocusId, setAgendaAutoFocusId] = useState<string | null>(null);
  const [nextStepsAutoFocusId, setNextStepsAutoFocusId] = useState<string | null>(
    null,
  );

  // Title inline-edit state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  // For "underline matches text width" (autosizing)
  const measureRef = useRef<HTMLSpanElement>(null);
  const [titleInputWidthPx, setTitleInputWidthPx] = useState<number>(40);

  // Reset title draft when event changes / modal opens
  useEffect(() => {
    if (!event) return;
    setIsEditingTitle(false);
    setTitleDraft(event.title || "");
  }, [event?.id, event?.title]);

  // Focus + select when entering edit mode
  useEffect(() => {
    if (!isEditingTitle) return;
    requestAnimationFrame(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    });
  }, [isEditingTitle]);

  // Measure the text width so the underline matches the title length
  useLayoutEffect(() => {
    // If not open or no event, keep safe defaults
    if (!isOpen || !event) return;

    const text = titleDraft || " "; // measure something even when empty
    if (measureRef.current) {
      measureRef.current.textContent = text;

      // Add a tiny buffer so the caret doesn't look cramped
      const w = Math.ceil(measureRef.current.getBoundingClientRect().width) + 6;
      setTitleInputWidthPx(Math.max(40, w));
    }
  }, [titleDraft, isOpen, event]);

  function commitTitle() {
    if (!event) return;

    const next = titleDraft.trim();
    if (!next) {
      setTitleDraft(event.title || "");
      setIsEditingTitle(false);
      return;
    }

    // ✅ TODO: Persist to your real event store/state here
    // Example:
    // updateEvent(event.id, { title: next });

    setIsEditingTitle(false);
  }

  function cancelTitleEdit() {
    if (!event) return;
    setTitleDraft(event.title || "");
    setIsEditingTitle(false);
  }

  // Agenda
  function deleteAgendaItem(id: string) {
    setAgendaItems((prev) => prev.filter((it) => it.id !== id));
  }
  function addAgendaItem() {
    const id = crypto.randomUUID();
    setAgendaItems((prev) => [...prev, { id, text: "", done: false }]);
    setAgendaAutoFocusId(id);
  }
  function toggleAgendaItem(id: string) {
    setAgendaItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)),
    );
  }
  function changeAgendaText(id: string, text: string) {
    setAgendaItems((prev) => prev.map((it) => (it.id === id ? { ...it, text } : it)));
  }
  function commitAgendaItem(id: string) {
    if (agendaAutoFocusId === id) setAgendaAutoFocusId(null);
  }

  // Next steps
  function deleteNextStepsItem(id: string) {
    setNextStepsItems((prev) => prev.filter((it) => it.id !== id));
  }
  function addNextStepsItem() {
    const id = crypto.randomUUID();
    setNextStepsItems((prev) => [...prev, { id, text: "", done: false }]);
    setNextStepsAutoFocusId(id);
  }
  function toggleNextStepsItem(id: string) {
    setNextStepsItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)),
    );
  }
  function changeNextStepsText(id: string, text: string) {
    setNextStepsItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, text } : it)),
    );
  }
  function commitNextStepsItem(id: string) {
    if (nextStepsAutoFocusId === id) setNextStepsAutoFocusId(null);
  }

  // Render null AFTER hooks (safe)
  if (!isOpen || !event) return null;

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
          <div style={{ fontSize: 20, fontWeight: 700, color: "#000000" }}>
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

        <div style={{ padding: "24px 50px" }}>
          <HeadingWithLine title="Event Details" />

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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {!isEditingTitle ? (
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#000000",
                    cursor: "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {titleDraft || "Untitled event"}
                </div>
              ) : (
                <div style={{ position: "relative", display: "inline-block" }}>
                  {/* Hidden measurer (matches input typography) */}
                  <span
                    ref={measureRef}
                    style={{
                      position: "absolute",
                      visibility: "hidden",
                      whiteSpace: "pre",
                      fontSize: 16,
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      paddingBottom: 2,
                    }}
                  />

                  <input
                    ref={titleInputRef}
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={commitTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitTitle();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        cancelTitleEdit();
                      }
                    }}
                    style={{
                      width: titleInputWidthPx,
                      fontSize: 16,
                      fontWeight: 500,
                      color: "#000000",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      borderBottom: "1px solid #A4A9AD", // ✅ underline color
                      paddingBottom: 2,
                    }}
                    aria-label="Edit event title"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
                opacity: 0.8,
              }}
              aria-label="Edit title"
              title="Edit title"
            >
              <Image
                src="/icons/Edit_Pencil_01.svg"
                alt="Edit"
                width={16}
                height={16}
                draggable={false}
              />
            </button>
          </div>

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
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Image src="/icons/clock.svg" alt="Time" width={16} height={16} />
              {formatTimeRange(event.start, event.end)}
            </span>

            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Image src="/icons/calendar.svg" alt="Date" width={16} height={16} />
              {formatDateLabel(event.start)}
            </span>
          </div>

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
              marginBottom: 8,
            }}
            disabled
          >
            Join meeting
          </button>

          {/* Agenda */}
          <HeadingWithLine title="Agenda" />
          {agendaItems.length === 0 && (
            <div style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
              No agenda yet
            </div>
          )}
          {agendaItems.map((item) => (
            <ChecklistRow
              key={item.id}
              id={item.id}
              text={item.text}
              done={item.done}
              placeholder="Type here"
              autoFocus={agendaAutoFocusId === item.id}
              onToggle={toggleAgendaItem}
              onChangeText={changeAgendaText}
              onCommit={commitAgendaItem}
              onDelete={deleteAgendaItem}
            />
          ))}
          <AddRow label="Add item" onClick={addAgendaItem} />

          {/* Next Steps */}
          <HeadingWithLine title="Next Steps" />
          {nextStepsItems.length === 0 && (
            <div style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
              No next steps yet
            </div>
          )}
          {nextStepsItems.map((item) => (
            <ChecklistRow
              key={item.id}
              id={item.id}
              text={item.text}
              done={item.done}
              placeholder="Type here"
              autoFocus={nextStepsAutoFocusId === item.id}
              onToggle={toggleNextStepsItem}
              onChangeText={changeNextStepsText}
              onCommit={commitNextStepsItem}
              onDelete={deleteNextStepsItem}
            />
          ))}
          <AddRow label="Add item" onClick={addNextStepsItem} />

          {/* Files */}
          <HeadingWithLine title="Files" />
          {files.length === 0 ? (
            <>
              <div style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
                No files yet
              </div>
              <AddRow label="Add file" onClick={() => {}} />
            </>
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

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 24,
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
"use client";

import React, { useEffect, useState } from "react";
import AddRow from "./AddRow";
import ChecklistRow from "./ChecklistRow";
import EventDetailsSection from "./EventDetailsSection";

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
   * We render null after hooks instead.
   */

  const [agendaItems, setAgendaItems] = useState<ChecklistItem[]>([]);
  const [nextStepsItems, setNextStepsItems] = useState<ChecklistItem[]>([]);
  const [files, setFiles] = useState<{ name: string }[]>([]);

  const [agendaAutoFocusId, setAgendaAutoFocusId] = useState<string | null>(null);
  const [nextStepsAutoFocusId, setNextStepsAutoFocusId] = useState<string | null>(
    null,
  );

  // Title draft is owned here (parent), UI lives in EventDetailsSection
  const [titleDraft, setTitleDraft] = useState("");

  // Reset local modal state when opening a different event (or opening modal)
  useEffect(() => {
    if (!event) return;
    setTitleDraft(event.title || "");

    // Optional: reset these per-event so they don't carry across events
    setAgendaItems([]);
    setNextStepsItems([]);
    setFiles([]);
    setAgendaAutoFocusId(null);
    setNextStepsAutoFocusId(null);
  }, [event?.id]);

  function commitTitle() {
    if (!event) return;

    const next = titleDraft.trim();
    if (!next) {
      setTitleDraft(event.title || "");
      return;
    }

    // ✅ TODO: Persist title change to your real event store/state here
    // Example:
    // updateEvent(event.id, { title: next });
  }

  function cancelTitleEdit() {
    if (!event) return;
    setTitleDraft(event.title || "");
  }

  // Agenda handlers
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
    setAgendaItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, text } : it)),
    );
  }

  function commitAgendaItem(id: string) {
    if (agendaAutoFocusId === id) setAgendaAutoFocusId(null);
  }

  // Next Steps handlers
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

        {/* Body */}
        <div style={{ padding: "24px 50px" }}>
          {/* ✅ Extracted Event Details section */}
          <EventDetailsSection
            event={event}
            titleDraft={titleDraft}
            setTitleDraft={setTitleDraft}
            onCommitTitle={commitTitle}
            onCancelTitle={cancelTitleEdit}
          />

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

          {/* Footer buttons */}
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
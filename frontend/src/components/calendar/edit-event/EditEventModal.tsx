"use client";

import React, { useEffect, useRef, useState } from "react";
import AddRow from "./AddRow";
import ChecklistRow from "./ChecklistRow";
import EventDetailsSection from "./EventDetailsSection";

import SaveButton from "../buttons/SaveButton";
import DeleteButton from "../buttons/DeleteButton";

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

    meetingLink?: string | null;
    agendaItems?: { id: string; text: string; done: boolean }[];
    nextStepsItems?: { id: string; text: string; done: boolean }[];
    files?: { name: string }[];
  } | null;

  onSaveEvent?: (
    eventId: string,
    updates: {
      title: string;
      description: string;
      meetingLink: string | null;
      agendaItems: { id: string; text: string; done: boolean }[];
      nextStepsItems: { id: string; text: string; done: boolean }[];
      files: { name: string }[];
    },
  ) => void;

  onDeleteEvent?: (eventId: string) => void;
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

function stringifyComparable(value: unknown) {
  return JSON.stringify(value);
}

export default function EditEventModal({
  isOpen,
  onClose,
  event,
  onSaveEvent,
  onDeleteEvent,
}: EditEventModalProps) {
  const [agendaItems, setAgendaItems] = useState<ChecklistItem[]>([]);
  const [nextStepsItems, setNextStepsItems] = useState<ChecklistItem[]>([]);
  const [files, setFiles] = useState<{ name: string }[]>([]);

  // Owned here, UI is in EventDetailsSection
  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  const [agendaAutoFocusId, setAgendaAutoFocusId] = useState<string | null>(
    null,
  );
  const [nextStepsAutoFocusId, setNextStepsAutoFocusId] = useState<
    string | null
  >(null);

  const baselineRef = useRef<{
    title: string;
    description: string;
    meetingLink: string | null;
    agendaItems: ChecklistItem[];
    nextStepsItems: ChecklistItem[];
    files: { name: string }[];
  } | null>(null);

  const [isDirty, setIsDirty] = useState(false);

  // Reset local modal state when opening a different event
  useEffect(() => {
    if (!event) return;

    setTitleDraft(event.title || "");
    setDescriptionDraft(event.description || "");

    setMeetingLink(event.meetingLink ?? null);
    setAgendaItems(event.agendaItems ?? []);
    setNextStepsItems(event.nextStepsItems ?? []);
    setFiles(event.files ?? []);

    setAgendaAutoFocusId(null);
    setNextStepsAutoFocusId(null);

    baselineRef.current = {
      title: event.title || "",
      description: event.description || "",
      meetingLink: event.meetingLink ?? null,
      agendaItems: event.agendaItems ?? [],
      nextStepsItems: event.nextStepsItems ?? [],
      files: event.files ?? [],
    };

    setIsDirty(false);
  }, [event?.id]);

  // ✅ Compute dirty whenever any editable state changes
  // IMPORTANT: dependency array must be constant length AND stable values
  useEffect(() => {
    if (!event) return;
    if (!baselineRef.current) return;

    const current = {
      title: titleDraft,
      description: descriptionDraft,
      meetingLink,
      agendaItems,
      nextStepsItems,
      files,
    };

    const dirty =
      stringifyComparable(current) !== stringifyComparable(baselineRef.current);

    setIsDirty(dirty);
  }, [
    event?.id, // ✅ not "event"
    titleDraft,
    descriptionDraft,
    meetingLink,
    agendaItems,
    nextStepsItems,
    files,
  ]);

  function commitTitle() {
    if (!event) return;
    const next = titleDraft.trim();
    if (!next) setTitleDraft(event.title || "");
  }

  function cancelTitleEdit() {
    if (!event) return;
    setTitleDraft(event.title || "");
  }

  function handleSave() {
    if (!event) return;

    const payload = {
      title: titleDraft.trim() || event.title || "",
      description: descriptionDraft, // or: descriptionDraft.trim()
      meetingLink,
      agendaItems,
      nextStepsItems,
      files,
    };

    onSaveEvent?.(event.id, payload);

    baselineRef.current = { ...payload };
    setIsDirty(false);
  }

  function handleDelete() {
    if (!event) return;
    onDeleteEvent?.(event.id);
    onClose();
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

  // Next steps handlers
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
    maxHeight: "85vh",           // ✅ limit height
    display: "flex",             // ✅ allow body to flex
    flexDirection: "column",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
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
        <div
  style={{
    padding: "24px 50px",
    overflowY: "auto",      // ✅ scroll here
    flex: 1,                // ✅ take remaining height
    scrollbarWidth: "thin",
  }}
>
          <EventDetailsSection
            event={event}
            titleDraft={titleDraft}
            setTitleDraft={setTitleDraft}
            onCommitTitle={commitTitle}
            onCancelTitle={cancelTitleEdit}
            descriptionDraft={descriptionDraft}
            setDescriptionDraft={setDescriptionDraft}
            meetingLink={meetingLink}
            setMeetingLink={setMeetingLink}
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
            <DeleteButton
              label="Delete Event"
              onClick={handleDelete}
              disabled={false}
            />
            <SaveButton label="Save" disabled={!isDirty} onClick={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}
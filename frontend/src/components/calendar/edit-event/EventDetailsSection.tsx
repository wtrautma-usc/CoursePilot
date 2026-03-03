"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type EventLike = {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  description?: string;
};

type Props = {
  event: EventLike;

  // Title editing (owned by parent)
  titleDraft: string;
  setTitleDraft: (value: string) => void;
  onCommitTitle: () => void;
  onCancelTitle: () => void;

  // Description editing (owned by parent)
  descriptionDraft: string;
  setDescriptionDraft: (value: string) => void;

  // Meeting link (owned by parent)
  meetingLink: string | null;
  setMeetingLink: (v: string | null) => void;
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

export default function EventDetailsSection({
  event,
  titleDraft,
  setTitleDraft,
  onCommitTitle,
  onCancelTitle,
  descriptionDraft,
  setDescriptionDraft,
  meetingLink,
  setMeetingLink,
}: Props) {
  // ---------------- Top edit state ----------------
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const isEditingTop = isEditingTitle || isEditingDescription;

  // snapshot "before edit" values so outside click / Esc can cancel
  const titleBeforeRef = useRef<string>("");
  const descriptionBeforeRef = useRef<string>("");

  // refs for focusing
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // wrapper to detect outside clicks for top editor
  const topEditorRef = useRef<HTMLDivElement>(null);

  // ---------------- Meeting link edit state ----------------
  const [isEditingMeetingLink, setIsEditingMeetingLink] = useState(false);
  const [meetingLinkDraft, setMeetingLinkDraft] = useState("");
  const meetingLinkInputRef = useRef<HTMLInputElement>(null);

  const [isHoverMeetingRow, setIsHoverMeetingRow] = useState(false);

  // When a different event opens, reset edit state + drafts
  useEffect(() => {
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setIsEditingMeetingLink(false);

    setMeetingLinkDraft(meetingLink ?? "");
    setIsHoverMeetingRow(false);

    setTitleDraft(event.title || "");
    setDescriptionDraft(event.description || "");
  }, [event.id]); // ✅ constant dependency list

  // Keep meeting link draft synced if parent link changes
  useEffect(() => {
    setMeetingLinkDraft(meetingLink ?? "");
  }, [meetingLink]);

  // Focus title when top edit starts
  useEffect(() => {
    if (!isEditingTop) return;
    requestAnimationFrame(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    });
  }, [isEditingTop]);

  function exitTopEdit() {
    setIsEditingTitle(false);
    setIsEditingDescription(false);
  }

  function cancelTopEdit() {
    setTitleDraft(titleBeforeRef.current);
    setDescriptionDraft(descriptionBeforeRef.current);
    onCancelTitle(); // keep your parent cancellation logic (if it reverts empty title etc.)
    exitTopEdit();
  }

  function saveTopEdit() {
    // title commit function may trim/revert empty
    onCommitTitle();
    exitTopEdit();
  }

  function startEditingTop() {
    // snapshot both values
    titleBeforeRef.current = titleDraft;
    descriptionBeforeRef.current = descriptionDraft;

    setIsEditingTitle(true);
    setIsEditingDescription(true);
  }

  // Outside click cancels BOTH (single listener while editing)
  useEffect(() => {
    if (!isEditingTop) return;

    function onDocMouseDown(e: MouseEvent) {
      const root = topEditorRef.current;
      if (!root) return;

      if (e.target instanceof Node && !root.contains(e.target)) {
        cancelTopEdit();
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isEditingTop]); // ✅ constant dependency list

  function normalizeUrl(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  }

  function commitMeetingLink() {
    const normalized = normalizeUrl(meetingLinkDraft);

    if (!normalized) {
      setMeetingLink(null);
      setIsEditingMeetingLink(false);
      return;
    }

    setMeetingLink(normalized);
    setIsEditingMeetingLink(false);
  }

  function cancelMeetingLink() {
    setMeetingLinkDraft(meetingLink ?? "");
    setIsEditingMeetingLink(false);
  }

  function removeMeetingLink() {
    setMeetingLink(null);
    setMeetingLinkDraft("");
    setIsEditingMeetingLink(false);
    setIsHoverMeetingRow(false);
  }

  const hasMeetingLink = Boolean(meetingLink && meetingLink.trim().length > 0);

  const externalIconGrey = "/icons/External_Link.svg";
  const externalIconBlack = "/icons/External_Link_Black.svg";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* -------- Title + Description block -------- */}
      <div
        ref={topEditorRef}
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
      >
        {/* Title Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {!isEditingTop ? (
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#000000",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {titleDraft || "Untitled event"}
            </div>
          ) : (
            <input
              ref={titleInputRef}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveTopEdit(); // ✅ saves both
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancelTopEdit(); // ✅ cancels both
                }
              }}
              aria-label="Edit event title"
              placeholder="Event name"
              style={{
                width: "100%",
                height: 34,
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #DCE0E5",
                background: "#EDF0F2",
                outline: "none",
                color: "#000",
                boxSizing: "border-box",
                fontFamily: "Inter, sans-serif",
              }}
            />
          )}

          {/* Pencil opens BOTH (and disappears while editing) */}
          {!isEditingTop && (
            <button
              type="button"
              onClick={startEditingTop}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                opacity: 0.8,
              }}
              aria-label="Edit title and description"
            >
              <Image
                src="/icons/Edit_Pencil_01.svg"
                alt="Edit"
                width={16}
                height={16}
                draggable={false}
              />
            </button>
          )}
        </div>

        {/* Description */}
        {!isEditingTop ? (
          <div
            style={{
              fontSize: 12,
              color: descriptionDraft?.trim() ? "#000000" : "#9CA3AF",
              opacity: descriptionDraft?.trim() ? 0.85 : 1,
              lineHeight: "16px",
              userSelect: "none",
            }}
          >
            {descriptionDraft?.trim() ? descriptionDraft : "Add description"}
          </div>
        ) : (
          <textarea
            ref={descriptionRef}
            value={descriptionDraft}
            onChange={(e) => setDescriptionDraft(e.target.value)}
            onKeyDown={(e) => {
              // Enter saves BOTH (Shift+Enter makes newline)
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                saveTopEdit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                cancelTopEdit();
              }
            }}
            aria-label="Edit event description"
            placeholder="Add description"
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
        )}
      </div>

      {/* -------- Time + Date Row -------- */}
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
          color: "#111827",
          fontSize: 13,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
          {formatTimeRange(event.start, event.end)}
        </span>

        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Image src="/icons/calendar.svg" alt="Date" width={16} height={16} />
          {formatDateLabel(event.start)}
        </span>
      </div>

      {/* -------- Meeting Link Row -------- */}
      {!hasMeetingLink ? (
        !isEditingMeetingLink ? (
          <button
            type="button"
            onClick={() => setIsEditingMeetingLink(true)}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: "#A4A9AD",
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
            aria-label="Add meeting link"
          >
            <Image
              src={externalIconGrey}
              alt=""
              width={16}
              height={16}
              draggable={false}
            />
            <span>Add meeting link</span>
          </button>
        ) : (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Image
              src={externalIconGrey}
              alt=""
              width={16}
              height={16}
              draggable={false}
            />
            <input
              ref={meetingLinkInputRef}
              value={meetingLinkDraft}
              onChange={(e) => setMeetingLinkDraft(e.target.value)}
              onBlur={commitMeetingLink}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitMeetingLink();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancelMeetingLink();
                }
              }}
              placeholder="Paste meeting link"
              style={{
                width: 280,
                fontSize: 12,
                color: "#000000",
                background: "transparent",
                border: "none",
                outline: "none",
                borderBottom: "1px solid #A4A9AD",
                paddingBottom: 2,
                fontFamily: "Inter, sans-serif",
              }}
              aria-label="Meeting link input"
            />
          </div>
        )
      ) : (
        <div
          onMouseEnter={() => setIsHoverMeetingRow(true)}
          onMouseLeave={() => setIsHoverMeetingRow(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <a
            href={meetingLink!}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#000000",
              fontSize: 12,
              textDecoration: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
            aria-label="Open meeting link"
            title="Open meeting link"
          >
            <Image
              src={externalIconBlack}
              alt=""
              width={16}
              height={16}
              draggable={false}
            />
            <span style={{ color: "#000000" }}>Meeting link</span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeMeetingLink();
            }}
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
              opacity: isHoverMeetingRow ? 1 : 0,
              pointerEvents: isHoverMeetingRow ? "auto" : "none",
              transition: "opacity 0.15s ease",
            }}
            aria-label="Remove meeting link"
            title="Remove meeting link"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
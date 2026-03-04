export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type EventColorName = "coral" | "yellow" | "purple" | "teal";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  /** Named color key or hex (e.g. #20A39E) for custom colors */
  color: EventColorName | string;
  meetingLink: string | null;
  agendaItems: ChecklistItem[];
  nextStepsItems: ChecklistItem[];
  files: { name: string }[];
  description?: string;
};

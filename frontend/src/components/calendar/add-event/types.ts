export type EventDraft = {
  title: string;
  description: string;
  allDay: boolean;

  // yyyy-mm-dd (native <input type="date"> value)
  startDate: string;
  // hh:mm (native <input type="time"> value)
  startTime: string;

  endDate: string;
  endTime: string;

  // "teal" | "yellow" | "pink" | "green" | "#RRGGBB"
  color: string;
};

export type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventDraft) => void;
};
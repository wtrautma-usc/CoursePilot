export const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export const MONTH_NAMES = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;

export const CALENDAR_COLORS = {
  coral: "#E07856",
  yellow: "#F4B860",
  purple: "#B8A4D4",
  teal: "#20A39E",
  borderGray: "#DCE0E5",
  textGray: "#23001E",
  lightGray: "#fafafa",
} as const;

/** CSS background for event pills by color name */
export const EVENT_PILL_BG = {
  coral: "rgba(239, 91, 91, 0.85)",
  yellow: "rgba(255, 186, 73, 1)",
  purple: "rgba(184, 164, 212, 0.9)",
  teal: "rgba(32, 163, 158, 0.9)",
} as const;

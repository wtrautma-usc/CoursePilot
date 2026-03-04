import { PRESET_COLORS, COLORS } from "./constants";

export function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isHexColor(v: string) {
  return /^#([0-9a-fA-F]{6})$/.test(v);
}

export function normalizeHex(v: string) {
  let s = v.trim();
  if (!s) return "#000000";
  if (!s.startsWith("#")) s = "#" + s;
  s = s.toUpperCase();

  const m3 = s.match(/^#([0-9A-F]{3})$/);
  if (m3) {
    const [a, b, c] = m3[1].split("");
    return `#${a}${a}${b}${b}${c}${c}`;
  }

  if (isHexColor(s)) return s;
  return "#000000";
}

export function resolveColorValue(selected: string, customColors: string[]) {
  const preset = PRESET_COLORS.find((p) => p.key === selected);
  if (preset) return preset.color;
  if (customColors.includes(selected) && isHexColor(selected)) return selected;
  return COLORS.teal;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatDateMMDDYYYY(yyyyMmDd: string) {
  if (!yyyyMmDd) return "";
  const parts = yyyyMmDd.split("-");
  if (parts.length !== 3) return "";
  const [y, m, d] = parts;
  if (!y || !m || !d) return "";
  return `${m}/${d}/${y}`;
}

export function formatTime12h(hhMm: string) {
  if (!hhMm) return "";
  const parts = hhMm.split(":");
  if (parts.length < 2) return "";
  const hNum = Number(parts[0]);
  const mNum = Number(parts[1]);
  if (Number.isNaN(hNum) || Number.isNaN(mNum)) return "";

  const ampm = hNum >= 12 ? "PM" : "AM";
  let h = hNum % 12;
  if (h === 0) h = 12;
  return `${pad2(h)}:${pad2(mNum)} ${ampm}`;
}
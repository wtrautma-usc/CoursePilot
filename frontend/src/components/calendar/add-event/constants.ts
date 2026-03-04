export const COLORS = {
  headerBg: "#CFE9E7",
  headerBorder: "#5FAEA8",
  teal: "#20A39E",
  yellow: "#F4B860",
  pink: "#E7A3D6",
  green: "#7CB342",
  text: "#111",
  subText: "#555",
  inputBg: "#EDF0F2",
  inputBorder: "#DCE0E5",
};

export const DATEPILL = {
  radius: 8,
  border: "1px solid #DCE0E5",
  bg: "#EDF0F2",
  padY: 10,
  padX: 10,
  gap: 6,
};

export const PRESET_COLORS = [
  { key: "teal", color: COLORS.teal },
  { key: "yellow", color: COLORS.yellow },
  { key: "pink", color: COLORS.pink },
  { key: "green", color: COLORS.green },
] as const;
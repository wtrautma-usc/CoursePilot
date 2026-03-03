"use client";

type SectionProps = {
  title: string;
  emptyText: string;
  items: string[];
};

export default function Section({ title, emptyText, items }: SectionProps) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
        {title}
      </div>

      {items.length === 0 ? (
        <div style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 12 }}>
          {emptyText}
        </div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 12 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ fontSize: 12 }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
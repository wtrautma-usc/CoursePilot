import MonthGrid from "@/components/calendar/MonthGrid";


export default function CalendarView() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      

      {/* ========== MAIN CONTENT AREA ========== */}
      {/* Controls: background color (#F5F5F5), padding (24px margin around all edges), flex layout */}
      <main style={{ flex: 1, padding: 24, background: "#F5F5F5", display: "flex", gap: 24, overflow: "hidden" }}>
        {/* LEFT SECTION - Empty space for future components */}
        {/* Controls: width (35% of main area), background, border radius, padding */}
        <div style={{ flex: "0 0 35%", background: "#fff", borderRadius: 12, padding: 16 }}>
          {/* Space reserved for sidebar events/details */}
        </div>

        {/* RIGHT SECTION - Calendar */}
        {/* Controls: width (60% of main area) - sized to have uniform 24px gap on right */}
        <div style={{ flex: "0 0 63%" }}>
          <MonthGrid />
        </div>
      </main>
    </div>
  );
}
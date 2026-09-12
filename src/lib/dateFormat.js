// Shared date helpers for the Events collection. `dateLabel` (day/month) is
// deliberately NOT stored alongside an event's `date` -- it's fully derivable
// from it, so storing both would just be another thing an admin has to keep
// in sync by hand.
export function getDateLabel(dateStr) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" }),
    month: date.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }),
  };
}

export function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

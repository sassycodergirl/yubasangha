// Schedule page's own intro copy (subtitle/title/description) above the
// day-card grid -- the grid itself is PujaSchedule.jsx, reused directly from
// the homepage (same pattern as Theme.jsx on /theme-2026), so this is just
// the page's presentation-only lead-in, on the shared inner-page intro
// background (#d3d1d1, dark text) per convention.
export default function ScheduleIntro({ content }) {
  const { subtitle, title, description } = content;

  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] pt-20 sm:pt-28">
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10 lg:px-16">
        <p className="text-[11px] uppercase tracking-[0.35em] text-maroon">{subtitle}</p>
        <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
          {title[0]}
          <span className="block text-maroon">{title[1]}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink/70">{description}</p>
      </div>
    </section>
  );
}

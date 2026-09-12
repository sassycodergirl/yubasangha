// Small gold viewfinder-style brackets at each corner of a `relative`
// parent -- the ornate "framed card" accent used on the countdown cards
// (and reusable anywhere else that same treatment fits).
export default function CornerFrame({ tone = "border-gold" }) {
  const base = `pointer-events-none absolute size-3 ${tone}`;
  return (
    <>
      <span className={`${base} -left-px -top-px border-l-2 border-t-2`} />
      <span className={`${base} -right-px -top-px border-r-2 border-t-2`} />
      <span className={`${base} -left-px -bottom-px border-b-2 border-l-2`} />
      <span className={`${base} -right-px -bottom-px border-b-2 border-r-2`} />
    </>
  );
}

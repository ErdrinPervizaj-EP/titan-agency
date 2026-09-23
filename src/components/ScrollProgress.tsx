/**
 * A thin brand-gradient bar across the top of the window that fills as the
 * page is scrolled. Driven by the browser's scroll timeline (no JS work per
 * frame); hidden where that is unsupported or motion is reduced.
 */
export default function ScrollProgress() {
  return <div aria-hidden className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left" />;
}

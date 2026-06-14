/** Read a layout property to force a synchronous reflow, so the class change
 *  right after it can trigger a CSS transition (otherwise the browser batches
 *  "append + add class" into one frame and the transition never fires). */
export function forceReflow(el: HTMLElement): void {
  el.getBoundingClientRect();
}

/** The small DOM factory used across the spaces: an element with a class and
 *  optional text. Replaces the near-identical copy each space file used to
 *  carry. Empty text is left unset, so it works for icon/decoration elements. */
export function makeEl(tag: string, className: string, text = ""): HTMLElement {
  const el = document.createElement(tag);
  el.className = className;
  if (text.length > 0) el.textContent = text;
  return el;
}

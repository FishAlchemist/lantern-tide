/** Resolve after `ms` milliseconds. The one shared timer-promise, replacing the
 *  per-file copies the tunnel and the boat each used to carry. */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Run `cb` when the main thread is next idle, so background work (warming the
 *  shop chunks) never competes with the current render. Falls back to a short
 *  timer where requestIdleCallback isn't available (older Safari). */
export function onIdle(cb: () => void): void {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(() => {
      cb();
    });
  } else {
    setTimeout(cb, 200);
  }
}

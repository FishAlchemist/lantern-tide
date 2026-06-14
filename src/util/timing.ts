/** Resolve after `ms` milliseconds. The one shared timer-promise, replacing the
 *  per-file copies the tunnel and the boat each used to carry. */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

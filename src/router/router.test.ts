import { describe, expect, it } from "vitest";
import { parsePath, routeToPath, type Route } from "./router";

describe("parsePath (path namespace routing under /street)", () => {
  it("root / → falls back to the default space, street (front door)", () => {
    expect(parsePath("/")).toEqual({ namespace: "street", room: null });
  });

  it("/street → the street (the hub)", () => {
    expect(parsePath("/street")).toEqual({ namespace: "street", room: null });
  });

  it("/street/cafe → cafe space, no room", () => {
    expect(parsePath("/street/cafe")).toEqual({
      namespace: "cafe",
      room: null,
    });
  });

  it("/street/library/window-seat → carries the room", () => {
    expect(parsePath("/street/library/window-seat")).toEqual({
      namespace: "library",
      room: "window-seat",
    });
  });

  it("unrecognised namespace under /street → falls back to street", () => {
    expect(parsePath("/street/nonsense")).toEqual({
      namespace: "street",
      room: null,
    });
  });

  it("a reserved root path (not /street) → street, leaving root free", () => {
    expect(parsePath("/about")).toEqual({ namespace: "street", room: null });
  });

  it("trailing slash with an empty room → room is null", () => {
    expect(parsePath("/street/cafe/")).toEqual({
      namespace: "cafe",
      room: null,
    });
  });
});

describe("routeToPath", () => {
  it("round-trips with parsePath (with a room)", () => {
    const route: Route = { namespace: "cafe", room: "fireplace" };
    expect(parsePath(routeToPath(route))).toEqual(route);
  });

  it("round-trips with parsePath (no room)", () => {
    const route: Route = { namespace: "library", room: null };
    expect(parsePath(routeToPath(route))).toEqual(route);
  });

  it("street (the hub) → /street", () => {
    expect(routeToPath({ namespace: "street", room: null })).toBe("/street");
  });

  it("a shop → /street/<shop>", () => {
    expect(routeToPath({ namespace: "lookout", room: null })).toBe(
      "/street/lookout",
    );
  });

  it("the hub collapses to /street even with a room (the hub has no rooms)", () => {
    expect(routeToPath({ namespace: "street", room: "anything" })).toBe(
      "/street",
    );
  });
});

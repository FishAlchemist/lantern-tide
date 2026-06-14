/* The shared paper-boat SVG: the four boat.css paths (wake, paper, deck, edge),
   in one place so the entrance boat (boat.ts) and the paper-boat shop
   (spaces/street/paperboat/paperboat.space.ts) draw the same shape and never drift apart.
   This module holds markup only — no CSS import, no behaviour — so borrowing
   the shape doesn't couple a consumer to the entrance flow. */

export const BOAT_SHAPE_SVG = `<svg viewBox="0 0 120 96" aria-hidden="true">
  <!-- Wake: two arcs behind the stern, hinting at forward motion (not straight
       lines, so it doesn't read as feet). -->
  <path class="boat__wake" d="M40 80 Q60 87 80 80 M48 88 Q60 92 72 88" />
  <!-- Classic paper-boat end profile: two peaks + a central trough + a curved
       hull. -->
  <path class="boat__paper" d="M26 22 L60 42 L94 22 L78 74 Q60 82 42 74 Z" />
  <!-- The hull below the fold line (darker), separating "sail" from "shell" so
       it reads as three-dimensional. -->
  <path class="boat__deck" d="M41 50 Q60 57 79 50 L78 74 Q60 82 42 74 Z" />
  <!-- Outline edge + centre fold: the edge facing the light brightens. -->
  <path
    class="boat__edge"
    d="M26 22 L60 42 L94 22 L78 74 Q60 82 42 74 Z M41 50 Q60 57 79 50"
  />
</svg>`;

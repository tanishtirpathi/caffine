export const VENUE_RESOURCES = [
  "Speaker",
  "Microphone",
  "Projector",
  "Whiteboard",
  "Air conditioning",
  "Stage",
] as const;

export type VenueResource = (typeof VENUE_RESOURCES)[number];

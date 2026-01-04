import { IMAGES, VIDEOS } from "./media";

export type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

export const MEDIA_SEQUENCE: MediaItem[] = [
  ...IMAGES.map((src) => ({ type: "image", src })),
  ...VIDEOS.map((src) => ({ type: "video", src })),
];

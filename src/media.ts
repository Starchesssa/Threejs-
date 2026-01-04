import { staticFile } from "remotion";

export type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

export const MEDIA: MediaItem[] = [
  { type: "image", src: staticFile("img/lv_0_20251229200212.png") },
  { type: "image", src: staticFile("img/lv_0_20251229200231.png") },
  { type: "image", src: staticFile("img/lv_0_20251229200259.png") },
  { type: "image", src: staticFile("img/lv_0_20251229200429.png") },
  { type: "image", src: staticFile("img/lv_0_20251229200448.png") },
  { type: "image", src: staticFile("img/lv_0_20251229200505.png") },

  { type: "video", src: staticFile("vid/lv_0_20260104111423.mp4") },
  { type: "video", src: staticFile("vid/lv_0_20260104111534.mp4") },
  { type: "video", src: staticFile("vid/lv_0_20260104111717.mp4") },
  { type: "video", src: staticFile("vid/lv_0_20260104111925.mp4") },
];

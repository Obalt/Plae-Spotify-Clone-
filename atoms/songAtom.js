import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null, //initial state
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

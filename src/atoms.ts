import { atom } from "recoil";

export const boxHeightAtom = atom({
  key: "boxHeight",
  default: 0,
});

export const top10BoxHeightAtom = atom({
  key: "top10BoxHeight",
  default: 0,
});

export const backAtom = atom({
  key: "back",
  default: false,
});

import { atom } from "recoil";
import { IGetMoviesResult } from "./api";

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

export const isBigMovieOpenAtom = atom({
  key: "isBigMovieOpen",
  default: false,
});

export const infoListAtom = atom<IGetMoviesResult>({
  key: "infoList",
  default: {
    dates: {
      maximum: "",
      minimum: "",
    },
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0,
  },
});

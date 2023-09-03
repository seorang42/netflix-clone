import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { IGetMoviesResult } from "./api";
import { styled } from "styled-components";
import { useSetRecoilState } from "recoil";
import { isBigMovieOpenAtom } from "./atoms";
import { makeImagePath } from "./utils";
import { useState } from "react";
import RatingBar from "./RatingBar";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  z-index: 11;
`;

const ClickedInfoBox = styled(motion.div)`
  position: fixed;
  width: 95%;
  max-width: 850px;
  height: 92vh;
  top: 4%;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: rgba(20, 20, 20, 1);
  border-radius: 15px;
  overflow: hidden;
  z-index: 12;
  display: flex;
  flex-direction: column;
`;

const ExitBtn = styled.div`
  position: absolute;
  width: 36px;
  height: 36px;
  background-color: rgba(20, 20, 20, 1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  left: auto;
  right: 0;
  margin: 15px;
  cursor: pointer;
`;

const Banner = styled.div`
  width: 100%;
  height: fit-content;
  position: relative;
  aspect-ratio: 16/9;
  background-image: linear-gradient(
    rgba(0, 0, 0, 0) 0%,
    rgba(20, 20, 20, 0.2) 50%,
    rgba(20, 20, 20, 1) 100%
  );
  overflow: hidden;
  flex-grow: 0;
`;

const BannerImg = styled.img`
  position: absolute;
  width: 100%;
  z-index: -1;
`;

const BannerBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  padding: 65px 48px;
  width: 100%;
`;

const BannerTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 30px;
`;

const BannerBtnBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const BannerBtn = styled(motion.div)`
  width: 42px;
  height: 42px;
  background-color: rgba(35, 35, 35, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px rgba(145, 145, 145, 1) solid;
  border-radius: 50%;
  font-size: 1.2rem;
  margin-left: 8px;
  cursor: pointer;
`;

const BannerPlayBtn = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 30px;
  border-radius: 5px;
  background-color: white;
  color: black;
  cursor: pointer;
  & > svg {
    font-size: 24px;
  }
`;

const RatingBtnBox = styled(motion.div)`
  width: 142.5px;
  height: 52.5px;
  position: absolute;
  border-radius: 26.25px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7.5px;
  background-color: rgba(35, 35, 35, 1);
  transform-origin: center;
`;

const RatingBtn = styled(motion.div)`
  width: 37.5px;
  height: 37.5px;
  border-radius: 50%;
  background-color: rgba(35, 35, 35, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &:hover {
    background-color: rgba(54, 54, 54, 1);
  }
  &:first-child > svg {
    transform: rotate(180deg);
  }
  &:last-child > svg {
    position: absolute;
  }
  &:last-child > svg:first-child {
    z-index: 1;
    transform: translate(4.5px, -3px);
  }
  &:last-child > svg:last-child {
    z-index: 3;
    transform: translate(-3px, 1.5px);
  }
`;

const BannerSoundBtn = styled(BannerBtn)`
  position: absolute;
  opacity: 0.5;
  left: auto;
  right: 0;
  transition: opacity 0.5s, color 0.5s, border 0.5s;
  &:hover {
    opacity: 1;
    color: white;
    border-color: white;
  }
`;

const InfoBox = styled.div`
  padding: 10px 48px;
  display: flex;
  gap: 30px;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 35px;
`;

const LeftInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  gap: 20px;
`;

const RatingBarBox = styled.div`
  display: flex;
  align-items: center;
  & > span:last-child {
    font-size: 0.8rem;
  }
`;

const Overview = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 11;
  -webkit-box-orient: vertical;
`;

const RightInfoBox = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExtraInfo = styled.div`
  & > span {
    display: flex;
    align-items: center;
  }
  & > span > p {
    color: rgba(119, 119, 119, 1);
    font-size: 0.9rem;
  }
`;

const ratingBtnBoxVarients = {
  normal: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: { delay: 0.5, duration: 0.2, type: "tween" },
  },
  rest: { scaleX: 0, opacity: 0, transition: { duration: 0.2 } },
};

const ratingBtnVariants = {
  hover: {
    backgroundColor: "rgba(54, 54, 54, 1)",
    transition: { backgroundColor: { duration: 0 } },
  },
  rest: {
    backgroundColor: "rgba(35, 35, 35, 1)",
    transition: { backgroundColor: { duration: 0 } },
  },
};

interface IClickedMovie {
  list: IGetMoviesResult;
}

function ClickedInfo({ list }: IClickedMovie) {
  const navigate = useNavigate();
  const setIsBigMovieOpen = useSetRecoilState(isBigMovieOpenAtom);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const urlSlider = urlSearchParams.get("sliderKey");
  const infoMatch = useMatch("info/:movieId");
  const [isVolumeOn, setIsVolumeOn] = useState(false);
  const clickedMovie =
    infoMatch?.params.movieId &&
    list?.results.find(
      (movie) => String(movie.id) === infoMatch.params.movieId
    );
  const onOverlayClicked = () => {
    setIsBigMovieOpen(false);
    navigate(-1);
  };
  const toggleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };
  return (
    <AnimatePresence>
      {infoMatch && clickedMovie ? (
        <>
          <Overlay
            onClick={onOverlayClicked}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <ClickedInfoBox
            layoutId={`${clickedMovie.id}?sliderKey=${urlSlider}`}
          >
            <Banner>
              <ExitBtn onClick={onOverlayClicked}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </ExitBtn>
              <BannerImg
                src={makeImagePath(
                  clickedMovie.backdrop_path !== null
                    ? clickedMovie.backdrop_path
                    : clickedMovie.poster_path,
                  "w500"
                )}
              />
              <BannerBox>
                <BannerTitle>
                  {clickedMovie.title !== undefined
                    ? clickedMovie.title
                    : clickedMovie.name}
                </BannerTitle>
                <BannerBtnBox>
                  <BannerPlayBtn>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 384 512"
                      fill="currentColor"
                    >
                      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                    </svg>
                    <span>재생</span>
                  </BannerPlayBtn>
                  <BannerBtn>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                  </BannerBtn>
                  <BannerBtn initial="normal" whileHover="hover" animate="rest">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                    >
                      <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                    </svg>
                    <RatingBtnBox variants={ratingBtnBoxVarients}>
                      <RatingBtn>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                        </svg>
                      </RatingBtn>
                      <RatingBtn>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                        </svg>
                      </RatingBtn>
                      <RatingBtn
                        initial="normal"
                        whileHover="hover"
                        animate="rest"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                        </svg>
                        <motion.div
                          variants={ratingBtnVariants}
                          style={{
                            position: "absolute",
                            width: "7.5px",
                            height: "15px",
                            transform: "translateX(-3px)",
                            backgroundColor: "rgba(35, 35, 35, 1)",
                            zIndex: 2,
                          }}
                        ></motion.div>
                        <motion.div
                          variants={ratingBtnVariants}
                          style={{
                            position: "absolute",
                            width: "7.5px",
                            height: "7.5px",
                            transform: "translateY(4.5px)",
                            backgroundColor: "rgba(35, 35, 35, 1)",
                            zIndex: 2,
                          }}
                        ></motion.div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                        </svg>
                      </RatingBtn>
                    </RatingBtnBox>
                  </BannerBtn>
                  <BannerSoundBtn onClick={toggleVolume}>
                    {isVolumeOn ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 640 512"
                        fill="currentColor"
                      >
                        <path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 576 512"
                        fill="currentColor"
                      >
                        <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" />
                      </svg>
                    )}
                  </BannerSoundBtn>
                </BannerBtnBox>
              </BannerBox>
            </Banner>
            <InfoBox>
              <LeftInfoBox>
                <RatingBarBox>
                  <span>
                    <RatingBar score={clickedMovie.vote_average / 2} />
                  </span>
                  <span>{`(${clickedMovie.vote_count}명)`}</span>
                </RatingBarBox>
                <Overview>
                  {clickedMovie.overview !== ""
                    ? clickedMovie.overview
                    : "등록된 요악 정보가 없습니다."}
                </Overview>
              </LeftInfoBox>
              <RightInfoBox>
                {clickedMovie.media_type !== undefined ? (
                  clickedMovie.media_type === "movie" ? (
                    <ExtraInfo>
                      <span>
                        <p>구분:</p>&nbsp;영화
                      </span>
                    </ExtraInfo>
                  ) : (
                    <ExtraInfo>
                      <span>
                        <p>구분:</p>&nbsp;시리즈
                      </span>
                    </ExtraInfo>
                  )
                ) : null}
                {clickedMovie.release_date !== undefined ? (
                  <ExtraInfo>
                    <span>
                      <p>개봉일:</p>&nbsp;
                      {clickedMovie.release_date}
                    </span>
                  </ExtraInfo>
                ) : null}
                {clickedMovie.first_air_date !== undefined ? (
                  <ExtraInfo>
                    <span>
                      <p>첫 방영일:</p>&nbsp;
                      {clickedMovie.first_air_date}
                    </span>
                  </ExtraInfo>
                ) : null}
                {clickedMovie.adult !== undefined ? (
                  clickedMovie.adult ? (
                    <ExtraInfo>
                      <span>
                        <p>청소년 관람 여부:</p>&nbsp;불가능
                      </span>
                    </ExtraInfo>
                  ) : (
                    <ExtraInfo>
                      <span>
                        <p>청소년 관람 여부:</p>&nbsp;가능
                      </span>
                    </ExtraInfo>
                  )
                ) : null}
                {clickedMovie.original_name !== undefined ? (
                  <ExtraInfo>
                    <span>
                      <p>원제목:</p>&nbsp;
                      {clickedMovie.original_name}
                    </span>
                  </ExtraInfo>
                ) : null}
                {clickedMovie.original_title !== undefined ? (
                  <ExtraInfo>
                    <span>
                      <p>원제목:</p>&nbsp;
                      {clickedMovie.original_title}
                    </span>
                  </ExtraInfo>
                ) : null}
              </RightInfoBox>
            </InfoBox>
          </ClickedInfoBox>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default ClickedInfo;

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
import { backAtom, boxHeightAtom } from "./atoms";
import { useNavigate } from "react-router-dom";
import { makeImagePath } from "./utils";
import { IGetMoviesResult, getList } from "./api";
import { useQuery } from "react-query";

const SliderWrapper = styled.div<{ boxHeight: number }>`
  position: relative;
  top: -290px;
  margin-top: 90px;
  height: ${(props) => `${props.boxHeight}px`};
  span {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 55px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    cursor: pointer;
  }
  &:hover span svg {
    opacity: 1;
  }
  span svg {
    transition: scale 0.1s ease-in;
  }
  span:hover svg {
    scale: 1.3;
  }
  &:hover h1 h2:last-child {
    opacity: 1;
  }
`;

const SliderTitleBox = styled(motion.h1)`
  margin-left: 60px;
  margin-bottom: 10px;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
`;

const SliderTitle = styled.h2``;

const SliderMore = styled.h2`
  opacity: 0;
  display: flex;
  font-size: 0.8rem;
  margin-left: 15px;
  color: rgba(84, 185, 197, 1);
  align-items: center;
  transform: translateY(3px);
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
  padding: 0 60px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  width: ${window.outerWidth / 6};
  aspect-ratio: 16/9;
  font-size: 24px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const SliderPrevBtn = styled.span`
  left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  svg {
    font-size: 1.5rem;
    opacity: 0;
  }
`;

const SliderNextBtn = styled.span`
  right: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  svg {
    font-size: 1.5rem;
    opacity: 0;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth : window.outerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth : -window.outerWidth,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const sliderMorePVariants = {
  rest: { x: -10, opacity: 0 },
  hover: { x: 0, opacity: 1, transition: { delay: 0.2, type: "tween" } },
};

const sliderMoreSVGVariants = {
  rest: { scale: 1.2, x: -60, transition: { delay: 0.2, type: "tween" } },
  hover: { scale: 0.9, x: 5 },
};

const offset = 6;

interface ISlider {
  start?: number;
  title: string;
  type: string;
  sliderKey: string;
}

function Slider({ start, title, type, sliderKey }: ISlider) {
  const queryFunction = () => {
    return getList(type);
  };
  const { data: list, isLoading } = useQuery<IGetMoviesResult>(
    [{ type }],
    queryFunction
  );
  const boxRef = useRef<any>(null);
  const navigate = useNavigate();
  const [boxHeight, setBoxHeight] = useRecoilState(boxHeightAtom);
  const [back, setBack] = useRecoilState(backAtom);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      if (boxRef.current && list && !isLoading) {
        setBoxHeight(boxRef.current.clientHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [list, isLoading]);
  const increaseIndex = () => {
    if (list) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = list.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(false);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (list) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = list.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(true);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number, movieTitle: string) => {
    navigate(`/movies/${movieId}?sliderKey=${sliderKey}`);
    document.title = `${movieTitle} - 넷플릭스`;
  };
  return (
    <SliderWrapper boxHeight={boxHeight}>
      <SliderTitleBox initial="rest" whileHover="hover" animate="rest">
        <SliderTitle>{title}</SliderTitle>
        <SliderMore>
          <motion.p
            variants={sliderMorePVariants}
            transition={{ type: "tween" }}
          >
            모두 보기
          </motion.p>
          <motion.svg
            variants={sliderMoreSVGVariants}
            transition={{ type: "tween" }}
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
            fill="currentColor"
          >
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
          </motion.svg>
        </SliderMore>
      </SliderTitleBox>
      <AnimatePresence
        custom={back}
        initial={false}
        onExitComplete={toggleLeaving}
      >
        <Row
          custom={back}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {list?.results
            .slice(start)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                ref={boxRef}
                key={movie.id}
                layoutId={movie.id + `?sliderKey=${sliderKey}`}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(movie.id, movie.title)}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <SliderPrevBtn onClick={decreaseIndex}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 320 512"
          fill="currentColor"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      </SliderPrevBtn>
      <SliderNextBtn onClick={increaseIndex}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 320 512"
          fill="currentColor"
        >
          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
      </SliderNextBtn>
    </SliderWrapper>
  );
}

export default Slider;

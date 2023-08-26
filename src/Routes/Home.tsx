import { useQuery } from "react-query";
import { IGetMoviesResult, getList } from "../api";
import { styled } from "styled-components";
import { Helmet } from "react-helmet";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import Slider from "../Slider";
import Footer from "../Footer";
import Top10Slider from "../Top10Slider";
import RatingBar from "../RatingBar";

const Wrapper = styled.div`
  background-color: rgba(20, 20, 20, 1);
  overflow-x: hidden;
  padding-bottom: 15px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  display: flex;
  width: 100%;
  height: fit-content;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  position: relative;
  aspect-ratio: 16/9;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0) 0%,
      rgba(20, 20, 20, 0.2) 50%,
      rgba(20, 20, 20, 1) 100%
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const BannerBox = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 16px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
`;

const BtnBox = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  div {
    cursor: pointer;
    border-radius: 5px;
    padding: 12px 30px;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const PlayBtn = styled.div`
  background-color: white;
  color: black;
`;

const InfoBtn = styled.div`
  color: white;
  background-color: rgba(138, 138, 138, 0.8);
`;

const SliderBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -290px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  position: relative;
  top: -80px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

function Home() {
  const queryFunction = () => {
    return getList("trending/all/day");
  };
  const { data: list, isLoading } = useQuery<IGetMoviesResult>(
    ["all", "trending"],
    queryFunction
  );
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("movies/:movieId");
  const urlSearchParams = new URLSearchParams(window.location.search);
  const sliderKey = urlSearchParams.get("sliderKey");
  const onOverlayClicked = () => navigate(-1);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    list?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      <Helmet>
        <title>홈 - 넷플릭스</title>
      </Helmet>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(list?.results[0].backdrop_path || "")}>
            <BannerBox>
              <Title>
                {list?.results[0].title !== undefined
                  ? list?.results[0].title
                  : list?.results[0].name}
              </Title>
              <Overview>{list?.results[0].overview}</Overview>
              <BtnBox>
                <PlayBtn>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                  >
                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                  </svg>
                  <span>재생</span>
                </PlayBtn>
                <InfoBtn>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                  </svg>
                  <span>상세 정보</span>
                </InfoBtn>
              </BtnBox>
            </BannerBox>
          </Banner>
          <SliderBox>
            <Slider
              start={1}
              sliderKey="1"
              title="지금 뜨는 콘텐츠"
              type="trending/all/day"
            />
            <Top10Slider
              sliderKey="4"
              title="오늘의 TOP 10 영화"
              type="trending/movie/day"
            />
            <Slider
              sliderKey="2"
              title="최고의 평가를 받은 영화"
              type="movie/top_rated"
            />
            <Top10Slider
              sliderKey="4"
              title="오늘의 TOP 10 시리즈"
              type="trending/tv/day"
            />
            <Slider
              sliderKey="3"
              title="최고의 평가를 받은 시리즈"
              type="tv/top_rated"
            />
          </SliderBox>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={
                    bigMovieMatch.params.movieId + `?sliderKey=${sliderKey}`
                  }
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        {clickedMovie.title !== undefined
                          ? clickedMovie.title
                          : clickedMovie.name}
                      </BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
      <Footer />
    </Wrapper>
  );
}

export default Home;

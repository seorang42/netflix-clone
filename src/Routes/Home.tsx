import { useQuery } from "react-query";
import { IGetMoviesResult, getList } from "../api";
import { styled } from "styled-components";
import { Helmet } from "react-helmet";
import { makeImagePath } from "../utils";
import Slider from "../Slider";
import Footer from "../Footer";
import Top10Slider from "../Top10Slider";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { isBigMovieOpenAtom } from "../atoms";

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
  & > div {
    cursor: pointer;
    border-radius: 5px;
    padding: 12px 30px;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  & > div > svg {
    font-size: 24px;
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

function Home() {
  const isBigMovieOpen = useRecoilValue(isBigMovieOpenAtom);
  useEffect(() => {
    if (isBigMovieOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isBigMovieOpen]);
  const queryFunction = () => {
    return getList("trending/all/day");
  };
  const { data: list, isLoading } = useQuery<IGetMoviesResult>(
    ["all", "trending"],
    queryFunction
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
              apiLink="trending/all/day"
            />
            <Top10Slider
              sliderKey="2"
              title="오늘의 TOP 10 영화"
              apiLink="trending/movie/day"
            />
            <Slider
              sliderKey="3"
              title="최고의 평가를 받은 영화"
              apiLink="movie/top_rated"
            />
            <Top10Slider
              sliderKey="4"
              title="오늘의 TOP 10 시리즈"
              apiLink="trending/tv/day"
            />
            <Slider
              sliderKey="5"
              title="최고의 평가를 받은 시리즈"
              apiLink="tv/top_rated"
            />
          </SliderBox>
        </>
      )}
      <Footer />
    </Wrapper>
  );
}

export default Home;

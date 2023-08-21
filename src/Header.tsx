import { styled } from "styled-components";
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 14px;
  height: 68px;
  padding: 0px 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
  margin-left: 25px;
`;

const Item = styled.li<{ isActive: boolean }>`
  color: ${(props) =>
    props.isActive ? props.theme.white.lighter : props.theme.white.darker};
  white-space: nowrap;
  margin-left: 20px;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  &:hover {
    color: ${(props) => props.theme.white.veryDark};
  }
`;

const Search = styled.form`
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const Alarm = styled.div`
  color: white;
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
  cursor: pointer;
  svg {
    height: 20px;
  }
`;

const Notice = styled.div`
  background-color: red;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: auto;
  right: 0;
  span {
    color: white;
    font-size: 7px;
  }
`;

const Profile = styled.div`
  width: 52px;
  height: 32px;
  margin-left: 30px;
  display: flex;
  cursor: pointer;
  &:hover span > svg {
    transform: rotate(0deg);
  }
`;

const ProfileImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 3px;
  overflow: hidden;
  background-image: url("https://picsum.photos/id/237/32/32");
`;

const ProfileMore = styled.span`
  color: white;
  width: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  svg {
    transform: rotate(-180deg);
    transition: transform 0.2s;
  }
`;

const navVariants = {
  top: { backgroundColor: "rgba(0, 0, 0, 0)" },
  scroll: { backgroundColor: "rgba(20, 20, 20, 1)" },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/");
  const seriesMatch = useMatch("series");
  const moviesMatch = useMatch("movies");
  const latestMatch = useMatch("latest");
  const myListMatch = useMatch("my-list");
  const languageMatch = useMatch("language");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };
  useMotionValueEvent(scrollY, "change", (scrolledY) => {
    if (scrolledY > 80) {
      navAnimation.start("scroll");
    } else {
      navAnimation.start("top");
    }
  });
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    navigate(`search?keyword=${data.keyword}`);
  };
  return (
    <Nav variants={navVariants} initial="top" animate={navAnimation}>
      <Col>
        <Logo
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Item isActive={homeMatch !== null}>
            <Link to="/">홈</Link>
          </Item>
          <Item isActive={seriesMatch !== null}>
            <Link to="series">시리즈</Link>
          </Item>
          <Item isActive={moviesMatch !== null}>
            <Link to="movies">영화</Link>
          </Item>
          <Item isActive={latestMatch !== null}>
            <Link to="latest">NEW! 요즘 대세 콘텐츠</Link>
          </Item>
          <Item isActive={myListMatch !== null}>
            <Link to="my-list">내가 찜한 콘텐츠</Link>
          </Item>
          <Item isActive={languageMatch !== null}>
            <Link to="language">언어별로 찾아보기</Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            animate={{ x: searchOpen ? -185 : 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            onClick={toggleSearch}
            style={{ cursor: "pointer" }}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            transition={{ type: "linear" }}
            placeholder="제목, 사람, 장르"
          />
        </Search>
        <Alarm>
          <Notice>
            <span>5</span>
          </Notice>
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
          </svg>
        </Alarm>
        <Profile>
          <ProfileImage></ProfileImage>
          <ProfileMore>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 320 512"
              fill="currentColor"
            >
              <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
            </svg>
          </ProfileMore>
        </Profile>
      </Col>
    </Nav>
  );
}

export default Header;

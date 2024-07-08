import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useCallback, useEffect, useState } from "react";
import * as userService from "../../apiServices/userService";
import ContentHomeItem from "./ContentHomeItem";
import svg from "../../assests/svg";
import { addRoute } from "../../redux/routeSlice";
import { debounce } from "../../helpers/debounce";

const cx = classNames.bind(styles);

const DEFAULT_TYPE = "for-you";
const MIN_PAGE = 1;
const MAX_PAGE = 5;

const Home = () => {
  const max = MAX_PAGE;
  const min = MIN_PAGE;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  const [contentData, setContentData] = useState([]);
  const [hideBtn, setHideBtn] = useState(true);
  const muted = useSelector((state) => state.volume.muted);
  const volumeValue = useSelector((state) => state.volume.value);
  const [page, setPage] = useState(randomNum);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addRoute(window.location.pathname));
  }, []);

  useEffect(() => {
    async function getContent() {
      setIsFetching(true);
      const res = await userService.getContent({ type: DEFAULT_TYPE, page });
      setIsFetching(false);
      setContentData((prev) => [...prev, ...res.data]);
    }
    getContent();
  }, [page]);

  useEffect(() => {
    if (window.scrollY >= 100) {
      setHideBtn(false);
    } else {
      setHideBtn(true);
    }
  }, [window.scrollY]);

  useEffect(() => {
    if (!isFetching) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = debounce(() => {
    if (
      window.scrollY + window.innerHeight >= document.body.offsetHeight &&
      !isFetching
    ) {
      if (!isFetching) setPage((page) => page + 1);
    }
  }, 100);

  const handeScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {contentData.map((item, idx) => {
          return (
            <ContentHomeItem
              muted={muted}
              volumeValue={volumeValue}
              key={idx}
              data={item}
            />
          );
        })}
      </div>

      {hideBtn ? (
        Fragment
      ) : (
        <div onClick={handeScrollToTop} className={cx("scroll-to-top")}>
          <img src={svg.scrollToTop} alt="icon" />
        </div>
      )}
    </div>
  );
};

export default Home;

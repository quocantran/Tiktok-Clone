import classNames from "classnames/bind";
import styles from "./Following.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useCallback, useEffect, useState } from "react";
import * as userService from "../../apiServices/userService";
import FollowingContent from "./FollowingContent";
import svg from "../../assests/svg";
import SuggestUser from "./SuggestUser";
import { addRoute } from "../../redux/routeSlice";
import { debounce } from "../../helpers/debounce";

const cx = classNames.bind(styles);

const DEFAULT_TYPE = "following";
const PAGE = 1;
const PER_PAGE = 18;

const Following = () => {
  const [contentData, setContentData] = useState([]);
  const [hideBtn, setHideBtn] = useState(true);
  const muted = useSelector((state) => state.volume.muted);
  const volumeValue = useSelector((state) => state.volume.value);
  const [page, setPage] = useState(PAGE);
  const [loading, setLoading] = useState();
  const isAuth = useSelector((state) => state.auth.login.success);
  const [suggestData, setSuggestData] = useState([]);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addRoute(window.location.pathname));
  }, []);

  useEffect(() => {
    if (isAuth) {
      setLoading(true);
      async function getFollowingVideo() {
        try {
          const res = await userService.getContent({
            type: DEFAULT_TYPE,
            page,
          });
          setContentData((prev) => [...prev, ...res?.data]);
          setLoading(false);
        } catch (err) {
          console.log();
        }
      }
      getFollowingVideo();
    } else {
      setLoading(true);
      async function getSuggestUser() {
        try {
          const res = await userService.getSuggest({ page, perPage: PER_PAGE });
          setSuggestData((prev) => [...prev, ...res?.data]);

          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      getSuggestUser();
    }
  }, [page, isAuth]);
  const handleScroll = debounce(() => {
    if (
      window.scrollY + window.innerHeight >= document.body.offsetHeight &&
      !loading
    ) {
      setPage((page) => page + 1);
    }
    if (window.scrollY >= 100) {
      setHideBtn(false);
    } else {
      setHideBtn(true);
    }
  }, 100);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handeScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={cx("wrapper")}>
      {!isAuth ? (
        <div className={cx("suggest-following")}>
          {suggestData?.map((item, idx) => {
            return (
              <SuggestUser
                index={index}
                setIndex={setIndex}
                idx={idx}
                data={item}
                key={item.id}
              />
            );
          })}
        </div>
      ) : loading ? (
        <></>
      ) : (
        <div className={cx("container")}>
          {contentData?.map((item, idx) => {
            return (
              <FollowingContent
                muted={muted}
                volumeValue={volumeValue}
                key={item.id}
                data={item}
              />
            );
          })}
        </div>
      )}

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

export default Following;

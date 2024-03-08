import classNames from "classnames/bind";
import styles from "./Explore.module.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addRoute } from "../../redux/routeSlice";

const cx = classNames.bind(styles);

const Explore = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addRoute(window.location.pathname));
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h2>COMING SOON!</h2>
      </div>
    </div>
  );
};

export default Explore;

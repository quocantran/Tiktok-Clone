import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import verifyUser from "../../apiServices/verifyUser";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { addRoute } from "../../redux/routeSlice";

const cx = classNames.bind(styles);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const routes = useSelector((state) => state.route.routes);
  useEffect(() => {
    dispatch(addRoute(window.location.pathname));
  }, []);

  useEffect(() => {
    verifyUser().then((user) => setUser(user));
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    setLoading(true);
    await loginUser(user, dispatch, navigate, routes);

    setLoading(false);
  };

  if (user) {
    toast.error("Bạn đã đăng nhập rồi!");
    navigate("/");
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("wrap-login")}>
          <form onSubmit={handleLogin} className={cx("login-form")}>
            <header className={cx("header")}>Login</header>
            <div className={cx("wrap-inp")}>
              <label className={cx("user-label")}>Email</label>
              <input
                type="email"
                className={cx("input")}
                placeholder="Type your Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <span className={cx("icon")}>
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>
            <div className={cx("wrap-inp")}>
              <label className={cx("user-label")}>Password</label>
              <input
                type="password"
                className={cx("input")}
                placeholder="Type your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span className={cx("icon")}>
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>

            <div className={cx("register")}>
              <Link to="/register">Don't have an account? Sign Up</Link>
              <Link style={{ display: "block" }} to="/">
                Home Page
              </Link>
            </div>
            <div className={cx("submit-btn")}>
              <button type="submit">
                {loading ? <Loading className="login-loading" /> : "LOGIN"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

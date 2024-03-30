import {
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSucces,
} from "./authSlice";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import request from "../ultis/request";

export const loginUser = async (user, dispatch, navigate, routes) => {
  dispatch(loginStart());

  try {
    const res = await request.post("/auth/login", user);
    dispatch(loginSuccess(res.data.data));
    toast.success("Đăng nhập thành công");

    Cookies.set("access_token", res.data.meta.token, {
      expires: 1,
      path: "/",
      secure: true,
      sameSite: "strict",
    });
    const lastRoute = routes[routes.length - 2];
    // check if user first time navigate to page
    if (routes.length <= 2) {
      navigate("/");
      return;
    }
    if (lastRoute != "/register") {
      navigate(-1);
    } else navigate("/");
  } catch (err) {
    if (err.response) {
      toast.error("Email hoặc mật khẩu không chính xác!");
      return err;
    }
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());

  try {
    await request.post("/auth/register", user);
    dispatch(registerSucces());
    toast.success("Đăng ký thành công!");
    navigate("/login");
  } catch (err) {
    if (err.response) {
      console.log(err);
      toast.error("Email đã tồn tại!");
      dispatch(registerFailed());
    }
  }
};

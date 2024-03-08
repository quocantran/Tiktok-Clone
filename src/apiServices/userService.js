import Cookies from "js-cookie";
import request from "../ultis/request";

export const getSuggest = async ({ page, perPage }) => {
  try {
    const res = await request.get("/users/suggested", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getContent = async ({ type, page }) => {
  try {
    const res = await request.get("/videos", {
      params: {
        type,
        page,
      },
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getFollowing = async ({ page }) => {
  try {
    const res = await request.get("/me/followings", {
      params: {
        page,
      },
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });
    return res.data;
  } catch (err) {}
};

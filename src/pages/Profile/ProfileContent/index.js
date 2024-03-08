import classNames from "classnames/bind";
import styles from "../../Profile/Profile.module.scss";
import Button from "../../../components/Button";
import { Fragment, useEffect, useRef, useState } from "react";
import noImage from "../../../assests/png/noImage.jpg";
import svg from "../../../assests/svg";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import request from "../../../ultis/request";
import { toast } from "react-toastify";
import VideoProfile from "./VideoProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const ProfileContent = ({ mount, setMount, data, followed, dataVideo }) => {
  const imgRef = useRef();
  const [isFollowed, setIsFollowed] = useState(followed);
  const { nickname } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = useSelector(
    (state) => state.auth.currentUser.data?.nickname
  );
  const isAuth = useSelector((state) => state.auth.login.success);
  const dark = useSelector((state) => state.theme.dark);
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(true);
  const item1 = useRef();
  const item2 = useRef();
  const lineRef = useRef();
  const avatarRef = useRef();
  const [update, setUpdate] = useState(false);
  const [countInp, setCountInp] = useState(0);
  const [isActiveButton, setIsActiveButton] = useState(false);
  const [firstName, setFirstName] = useState(data?.first_name);
  const [lastName, setLastName] = useState(data?.last_name);
  const [bio, setBio] = useState(data?.bio);
  const [avatar, setAvatar] = useState(data?.avatar);
  const [select, setSelect] = useState(false);

  useEffect(() => {
    if (dark) {
      if (active) {
        item1.current.style.color = "rgba(255, 255, 255, 0.9)";
        item2.current.style.color = "rgb(115, 116, 123)";
        lineRef.current.style.transform = "translateX(0%)";
      } else {
        item1.current.style.color = "rgb(115, 116, 123)";
        item2.current.style.color = "rgba(255, 255, 255, 0.9)";
        lineRef.current.style.transform = "translateX(100%)";
      }
    } else {
      if (active) {
        item1.current.style.color = "#161823";
        item2.current.style.color = "rgb(115, 116, 123)";
        lineRef.current.style.transform = "translateX(0%)";
      } else {
        item1.current.style.color = "rgb(115, 116, 123)";
        item2.current.style.color = "#161823";
        lineRef.current.style.transform = "translateX(100%)";
      }
    }
  }, [active, dark]);
  const handleClick = () => {
    if (!isAuth) {
      navigate("/login");
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    if (!isFollowed) {
      request.post(`/users/${data.id}/follow`, null, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
    } else {
      request.post(`/users/${data.id}/unfollow`, null, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
    }
    setIsFollowed(!isFollowed);
  };
  useEffect(() => {
    setIsFollowed(followed);
  }, [followed]);

  useEffect(() => {
    if (firstName?.length > 2 && lastName?.length > 2) {
      setIsActiveButton(true);
    } else {
      setIsActiveButton(false);
    }
  }, [firstName, lastName]);

  return (
    <section className={cx("container")}>
      <header className={cx("user-info")}>
        <div className={cx("account-info")}>
          <img
            ref={imgRef}
            src={data.avatar}
            alt="icon"
            onError={() => {
              imgRef.current.src = noImage;
            }}
            className={cx("user-avatar")}
          />
          <div>
            <h2 className={cx("nick-name")}>{data.nickname}</h2>
            <h1 className={cx("full-name")}>{`${
              data.first_name + " " + data.last_name
            }`}</h1>
            <div className={cx("interact-btn")}>
              {currentUser === nickname ? (
                <button
                  onClick={() => setUpdate(true)}
                  className={cx("update-profile")}
                >
                  <span className={cx("icon-update")}>
                    {dark ? (
                      <img src={svg.profileLight} alt="icon" />
                    ) : (
                      <img src={svg.profile} alt="icon" />
                    )}
                  </span>

                  <p>{t("Edit profile")}</p>
                </button>
              ) : (
                <Button onClick={handleClick} primary>
                  {isFollowed ? t("Following") : t("Follow")}
                </Button>
              )}
            </div>
          </div>
        </div>
        {dark ? (
          <img className={cx("share")} src={svg.shareLight} alt="icon" />
        ) : (
          <img className={cx("share")} src={svg.share} alt="icon" />
        )}
        <div className={cx("count-info")}>
          <strong>{data.followings_count}</strong>
          <span>{t("Following")}</span>
          <strong>{data.followers_count}</strong>
          <span>{t("Followers")}</span>
          <strong>{data.likes_count}</strong>
          <span>{t("Likes")}</span>
        </div>
        <p className={cx("bio")}>{data.bio ? data.bio : t("No bio yet.")}</p>
      </header>
      <div className={cx("video-profile")}>
        <div className={cx("tab-list")}>
          <div
            ref={item1}
            onClick={() => {
              setActive(true);
            }}
            className={cx("tab-item")}
          >
            Video
          </div>
          <div
            ref={item2}
            onClick={() => {
              setActive(false);
            }}
            className={cx("tab-item")}
          >
            {dark ? (
              <img src={svg.lockLight} alt="icon" />
            ) : (
              <img src={svg.lock} alt="icon" />
            )}
            <span>{t("Liked")}</span>
          </div>
          <div ref={lineRef} className={cx("tab-line")}></div>
        </div>
        <div className={cx("video-container")}>
          {active ? (
            dataVideo?.map((item, idx) => {
              return (
                <VideoProfile
                  index={index}
                  setIndex={setIndex}
                  idx={idx}
                  data={item}
                  key={idx}
                />
              );
            })
          ) : (
            <div className={cx("liked-content")}>
              <div className={cx("liked-container")}>
                {dark ? (
                  <img src={svg.lockLight} alt="icon" />
                ) : (
                  <img src={svg.lock} alt="icon" />
                )}
                <h2>Video đã thích của người dùng này ở trạng thái riêng tư</h2>
                <p>{`Các video được thích bởi ${data.nickname} hiện đang ẩn`}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {!update ? (
        Fragment
      ) : (
        <div className={cx("update-wrapper")}>
          <div className={cx("update-container")}>
            <header className={cx("header")}>
              <h1>Edit profile</h1>
              <div
                onClick={() => {
                  setUpdate(false);
                  setIsActiveButton(false);
                }}
                className={cx("close-icon")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </div>
            </header>
            <div className={cx("body")}>
              <div className={cx("edit-photo")}>
                <div className={cx("title-profile")}>Profile photo</div>
                <label className={cx("avatar-user")} htmlFor="avatarProfile">
                  <img
                    ref={avatarRef}
                    src={data.avatar}
                    alt="icon"
                    onError={() => {
                      avatarRef.current.src = noImage;
                    }}
                  />
                </label>
                <input
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setAvatar(e.target.files[0]);
                      setSelect(true);

                      const url = URL.createObjectURL(e.target.files[0]);

                      avatarRef.current.src = url;
                    }
                  }}
                  hidden
                  type="file"
                  tabIndex="-1"
                  id="avatarProfile"
                />
              </div>
              <div className={cx("edit-photo")}>
                <div className={cx("title")}>Họ</div>
                <div className={cx("input-user")}>
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Họ"
                    spellCheck={false}
                    className={cx("inp")}
                    value={firstName}
                  />

                  <p className={cx("tip")}>
                    Nhập họ của bạn (độ dài lớn hơn 2 ký tự)
                  </p>
                </div>
              </div>
              <div className={cx("edit-photo")}>
                <div className={cx("title")}>Tên</div>
                <div className={cx("input-user")}>
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Tên"
                    spellCheck={false}
                    className={cx("inp")}
                    value={lastName}
                  />
                  <p className={cx("tip")}>
                    Nhập tên của bạn(độ dài lớn hơn 2 ký tự)
                  </p>
                </div>
              </div>
              <div style={{ border: "none" }} className={cx("edit-photo")}>
                <div className={cx("title")}>Tiểu sử</div>
                <textarea
                  value={bio}
                  maxLength="80"
                  onChange={(e) => {
                    setCountInp(e.target.value.length);
                    setBio(e.target.value);
                  }}
                  placeholder="Tiểu sử"
                  className={cx("inp")}
                  spellCheck={false}
                />
                <p
                  style={{ marginLeft: "10px" }}
                  className={cx("tip")}
                >{`${countInp}/80`}</p>
              </div>
            </div>
            <div className={cx("button-wrapper")}>
              <button
                onClick={() => {
                  setIsActiveButton(false);
                  setUpdate(false);
                }}
                className={cx("close-btn")}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (isActiveButton) {
                    const formData = new FormData();
                    formData.append("first_name", firstName);
                    formData.append("last_name", lastName);
                    formData.append("bio", bio);
                    if (select) {
                      formData.append("avatar", avatar);
                    }

                    request
                      .post("/auth/me?_method=PATCH", formData, {
                        headers: {
                          Authorization: `Bearer ${Cookies.get(
                            "access_token"
                          )}`,
                        },
                      })
                      .then(() => {
                        setUpdate(false);
                        setMount(!mount);
                        setIsActiveButton(false);
                        toast.success("Cập nhật thông tin thành công!");
                      })
                      .catch((err) => {
                        toast.error("Vui lòng thử lại!");
                      });
                  }
                }}
                className={cx("submit-btn", {
                  active: isActiveButton,
                })}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileContent;

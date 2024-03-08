import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import classNames from "classnames/bind";
import styles from "./Upload.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useRef, useState } from "react";
import svg from "../../assests/svg";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import mobileBackground from "../../assests/png/mobileBackground.png";
import iconMobile from "../../assests/png/iconMobile.png";
import liveIcon from "../../assests/png/liveIcon.svg";
import searchIcon from "../../assests/png/searchIcon.svg";
import noImage from "../../assests/png/noImage.jpg";
import interactIcons from "../../assests/png/interactIcons.svg";
import { motion } from "framer-motion";
import VideoThumbnail from "react-video-thumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import request from "../../ultis/request";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { addRoute } from "../../redux/routeSlice";

const cx = classNames.bind(styles);

const Upload = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.auth.login.success);
  const dark = useSelector((state) => state.theme.dark);
  const { t } = useTranslation();
  const [videoTime, setVideoTime] = useState(0);
  const [file, setFile] = useState(null);
  const inputRef = useRef();
  const [srcVideo, setSrcVideo] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [isCaption, setIsCaption] = useState(true);
  const [snapshots, setSnapshots] = useState([]);
  const [stateCheck, setStateCheck] = useState({
    comment: true,
    duet: true,
    stitch: true,
  });
  const [leftValue, setLeftValue] = useState(0);
  const [play, setPlay] = useState(false);
  const [muted, setMuted] = useState(false);
  const [width, setWidth] = useState(0);
  const videoRef = useRef(null);
  const [isSelect, setIsSelect] = useState(false);
  const [selected, setSelected] = useState("Public");
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("");
  const currentUser = useSelector((state) => state.auth.currentUser.data);
  const [nameMusic, setNameMusic] = useState(
    `Original sound - ${currentUser?.nickname}`
  );
  const imgRef = useRef();
  const avatarRef = useRef();
  const thumbnailRef = useRef();
  const videoRefMobile = useRef(null);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const secondsToMinutesAndSeconds = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const animationVariants = {
    start: {
      rotate: 0,
    },
    end: {
      rotate: 360,
    },
  };

  const animationTransition = {
    duration: 6,
    ease: "linear",
    repeat: Infinity,
  };

  const handleToggleMuted = (e) => {
    e.stopPropagation();
    if (muted) {
      videoRefMobile.current.volume = 0.31;
    } else {
      videoRefMobile.current.volume = 0;
    }
    setMuted(!muted);
  };

  const handleTogglePlay = () => {
    setPlay(!play);
    if (!play) {
      videoRefMobile.current.play();
    } else {
      videoRefMobile.current.pause();
    }
  };

  const handleChange = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRefMobile.current.currentTime = newTime;
  };

  const handleMetadataLoaded = () => {
    setDuration(secondsToMinutesAndSeconds(videoRef.current.duration));

    videoRef.current.removeEventListener(
      "loadedmetadata",
      handleMetadataLoaded
    );
  };

  useEffect(() => {
    dispatch(addRoute(window.location.pathname));
  }, []);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
      toast.error("Vui lòng đăng nhập!");
      return;
    }
  }, []);

  useEffect(() => {
    if (!!file) {
      const video = videoRefMobile.current;

      video.addEventListener("timeupdate", () => {
        setVideoTime(video.currentTime);
      });
    }
  }, [file]);

  useEffect(() => {
    if (!!file) {
      videoRef.current.src = srcVideo;
      videoRefMobile.current.src = srcVideo;
      imgRef.current.src = currentUser.avatar;
      avatarRef.current.src = currentUser.avatar;
      videoRef.current.load();
      videoRef.current.addEventListener("loadedmetadata", handleMetadataLoaded);
    }
  }, [file, srcVideo]);

  useEffect(() => {
    if (videoRefMobile.current) {
      const video = videoRefMobile?.current;
      setWidth((video.currentTime / video.duration) * 100);
    }
  }, [videoRefMobile.current?.currentTime]);

  return (
    <div className={cx("wrapper")}>
      {modal ? (
        <div className={cx("modal-discard")}>
          <div className={cx("modal-container")}>
            <header>
              <div className={cx("title-modal")}>Hủy bỏ bài đăng này?</div>
              <div className={cx("desc-modal")}>
                Video và tất cả chỉnh sửa sẽ bị hủy bỏ.
              </div>
            </header>
            <Button
              onClick={() => {
                window.location.reload();
              }}
              primary
              className={cx("modal-btn")}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={() => {
                setModal(false);
              }}
              outline
              className={cx("modal-outline-btn")}
            >
              Tiếp tục chỉnh sửa
            </Button>
          </div>
        </div>
      ) : (
        Fragment
      )}
      {!!file ? (
        <div
          onClick={() => {
            if (isSelect) setIsSelect(false);
          }}
          className={cx("edit-container")}
        >
          <div className={cx("upload-header")}>
            <div className={cx("header-left")}>
              <div className={cx("video-card")}>
                <div className={cx("video-index")}>
                  <span>1</span>
                </div>
                <div className={cx("video-thumb")}>
                  <video ref={videoRef} src={srcVideo} muted />
                </div>

                <div className={cx("upload-video-info")}>
                  <span className={cx("file-name")}>{nameFile}</span>
                  <div className={cx("time-video")}>
                    <span>00:00</span>
                    <span>{duration}</span>
                    <span>
                      {duration.substring(1, 2) +
                        `m` +
                        duration.substring(3, 5) +
                        "s"}
                    </span>
                  </div>
                </div>
              </div>
              <Button primary className={cx("button-header")}>
                Edit video
              </Button>
            </div>

            <div className={cx("header-right")}>
              <div className={cx("split-body")}>
                <span className={cx("split-title")}>
                  {t("Split into multiple parts to get more exposure")}
                </span>

                <div className={cx("increase")}>
                  <div className={cx("minus")}>
                    <span>
                      <svg
                        fill="currentColor"
                        color="#b0b0b4"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                      >
                        <path d="M6 23a1 1 0 011-1h34a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z"></path>
                      </svg>
                    </span>
                  </div>
                  <div className={cx("split-num")}>
                    <span>2</span>
                  </div>

                  <div className={cx("plus")}>
                    <span>
                      <svg
                        fill="currentColor"
                        color="#b0b0b4"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                      >
                        <path d="M26 7a1 1 0 00-1-1h-2a1 1 0 00-1 1v15H7a1 1 0 00-1 1v2a1 1 0 001 1h15v15a1 1 0 001 1h2a1 1 0 001-1V26h15a1 1 0 001-1v-2a1 1 0 00-1-1H26V7z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <button className={cx("split-btn")}>Split</button>
            </div>
          </div>

          <div className={cx("upload-content")}>
            <div className={cx("details")}>
              <h1>{t("Upload video")}</h1>
              <h2>{t("Post a video to your account")}</h2>
              <div className={cx("details-container")}>
                <div className={cx("video-frame")}>
                  <div
                    onClick={handleTogglePlay}
                    className={cx("mobile-frame")}
                  >
                    <img
                      className={cx("background-mobile")}
                      src={mobileBackground}
                      alt="background"
                    />
                    <div className={cx("info-user")}>
                      <div className={cx("nick-name")}>
                        {currentUser.nickname}
                      </div>
                      <div className={cx("name-video")}>{nameFile}</div>
                      <div className={cx("music")}>
                        <img src={svg.musicLight} alt="icon" />
                        <div className={cx("name-music")}>
                          <span>{`${nameMusic}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className={cx("header-items")}>
                      <img src={liveIcon} alt="icon" />
                      <span>{t("Following")}</span>
                      <span className={cx("for-you")}>{t("For You")}</span>
                      <img src={searchIcon} alt="icon" />
                    </div>

                    <div className={cx("icon-mobile")}>
                      <img src={iconMobile} alt="icon" />
                    </div>

                    <div className={cx("interact-icons")}>
                      <img
                        className={cx("user-avatar")}
                        ref={avatarRef}
                        src={currentUser.avatar}
                        alt="icon"
                        onError={() => {
                          avatarRef.current.src = noImage;
                        }}
                      />

                      <img src={interactIcons} alt="icon" />

                      <div className={cx("cd-thumb")}>
                        <motion.div
                          style={{ width: "24px", height: "24px" }}
                          initial="start"
                          animate="end"
                          variants={play ? animationVariants : null}
                          transition={play ? animationTransition : null}
                        >
                          <img
                            ref={imgRef}
                            src={currentUser.avatar}
                            alt="icon"
                            onError={() => {
                              imgRef.current.src = noImage;
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    <div className={cx("video-preview")}>
                      <video
                        ref={videoRefMobile}
                        src={srcVideo}
                        muted={muted}
                        loop
                      />
                    </div>

                    <div className={cx("video-controls")}>
                      <div className={cx("controls-container")}>
                        <div className={cx("controls-content")}>
                          <div className={cx("controls")}>
                            <div
                              onClick={handleTogglePlay}
                              className={cx("play-btn")}
                            >
                              {play ? (
                                <img src={svg.pauseVideo} alt="icon" />
                              ) : (
                                <img src={svg.playVideo} alt="icon" />
                              )}
                            </div>
                            <div className={cx("control-time-video")}>
                              <div className={cx("current-time-video")}>
                                {formatTime(videoTime)}
                              </div>
                              <div>/</div>
                              <div className={cx("duration-video")}>
                                {duration}
                              </div>
                            </div>
                          </div>
                          <div
                            onClick={handleToggleMuted}
                            className={cx("volume-video")}
                          >
                            {muted ? (
                              <img src={svg.muted} alt="icon" />
                            ) : (
                              <img src={svg.volume} alt="icon" />
                            )}
                          </div>
                        </div>

                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={cx("progress-bar")}
                        >
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={
                              (videoRefMobile.current?.currentTime /
                                videoRefMobile.current?.duration) *
                              100
                            }
                            onChange={handleChange}
                          />
                          <div
                            className={cx("range-input")}
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cx("submit-form")}>
                  <div className={cx("captions")}>
                    <span className={cx("caption-title")}>
                      {isCaption ? t("Caption") : t("Music")}
                    </span>
                    <span className={cx("caption-length")}>{`${
                      isCaption ? nameFile.length : nameMusic.length
                    }/250`}</span>
                  </div>

                  <div className={cx("caption-content")}>
                    <input
                      spellCheck={false}
                      onChange={(e) => {
                        isCaption
                          ? setNameFile(e.target.value)
                          : setNameMusic(e.target.value);
                      }}
                      className={cx("caption-name")}
                      type="text"
                      value={isCaption ? nameFile : nameMusic}
                    />
                    <div
                      onClick={() => setIsCaption(!isCaption)}
                      className={cx("img-music")}
                    >
                      {isCaption ? (
                        dark ? (
                          <img src={svg.musicLight} alt="icon" />
                        ) : (
                          <img src={svg.music} alt="icon" />
                        )
                      ) : (
                        <FontAwesomeIcon
                          fill="currenColor"
                          icon={faPenToSquare}
                        />
                      )}
                    </div>
                  </div>

                  <div className={cx("cover")}>
                    <span>{t("Cover")}</span>
                    <div className={cx("thumb-img")}>
                      <div className={cx("thumb-container")}>
                        <input
                          onChange={(e) => {
                            thumbnailRef.current.currentTime = e.target.value;
                            setLeftValue(e.target.value);
                          }}
                          type="range"
                          min="0"
                          max="87"
                          step="1"
                        />
                        <div
                          style={{
                            left: leftValue > 0 ? `${leftValue}%` : null,
                          }}
                          className={cx("drag-box")}
                        >
                          <div className={cx("snap-shot")}>
                            <video ref={thumbnailRef} src={srcVideo} muted />
                          </div>
                        </div>
                        {[...Array(8)].map((res, index) => (
                          <div className={cx("image-wrapper")} key={index}>
                            <div className={cx("image-none")}>
                              <VideoThumbnail
                                videoUrl={srcVideo}
                                snapshotAtTime={index}
                                thumbnailHandler={(thumbnail) =>
                                  setSnapshots((prev) => [...prev, thumbnail])
                                }
                              />
                            </div>
                          </div>
                        ))}

                        {snapshots.map((res, index) => (
                          <div className={cx("snapshot-container")} key={index}>
                            <img
                              style={{ opacity: dark ? 0.8 : null }}
                              src={res}
                              alt="img"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={cx("permissions")}>
                    <span className={cx("select-title")}>
                      {t("Who can watch this video")}
                    </span>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={cx("selected")}
                    >
                      <div
                        onClick={() => {
                          setIsSelect(!isSelect);
                        }}
                        className={cx("selected-container")}
                      >
                        <span>{selected}</span>
                        <div className={cx("select-icon")}>
                          <svg
                            style={{
                              transform: isSelect ? "rotate(180deg)" : null,
                            }}
                            width="1em"
                            height="1em"
                            viewBox="0 0 48 48"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M25.5187 35.2284C24.7205 36.1596 23.2798 36.1596 22.4816 35.2284L8.83008 19.3016C7.71807 18.0042 8.63988 16 10.3486 16H37.6517C39.3604 16 40.2822 18.0042 39.1702 19.3016L25.5187 35.2284Z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      {isSelect ? (
                        <div className={cx("select-items")}>
                          <div
                            onClick={() => {
                              setSelected("Public");
                              setIsSelect(!isSelect);
                            }}
                            className={cx("select-item")}
                          >
                            <span>Public</span>
                          </div>
                          <div
                            onClick={() => {
                              setSelected("Friends");
                              setIsSelect(!isSelect);
                            }}
                            className={cx("select-item")}
                          >
                            <span>Friends</span>
                          </div>
                          <div
                            onClick={() => {
                              setSelected("Private");
                              setIsSelect(!isSelect);
                            }}
                            className={cx("select-item")}
                          >
                            <span>Private</span>
                          </div>
                        </div>
                      ) : (
                        Fragment
                      )}
                    </div>

                    <span className={cx("checkbox-title")}>
                      {t("Allow users to:")}
                    </span>
                    <div className={cx("check-box")}>
                      <div className={cx("check-box-content")}>
                        <div className={cx("check-box-item")}>
                          <div
                            style={{
                              backgroundColor: stateCheck.comment
                                ? null
                                : "transparent",
                            }}
                            className={cx("check-item")}
                          >
                            <svg
                              width="1.2rem"
                              height="1rem"
                              viewBox="0 0 10 8"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.88632 5.95189L8.77465 0.915431C8.96697 0.717276 9.28352 0.712552 9.48168 0.904878L9.67738 1.09483C9.87553 1.28715 9.88026 1.6037 9.68793 1.80185L4.34296 7.3088C4.093 7.56633 3.67963 7.56633 3.42967 7.3088L0.948335 4.75227C0.756009 4.55411 0.760734 4.23757 0.958888 4.04524L1.15459 3.85529C1.35275 3.66297 1.66929 3.66769 1.86162 3.86584L3.88632 5.95189Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>

                          <input
                            onChange={(e) => {
                              setStateCheck((prev) => ({
                                ...prev,
                                comment: !prev.comment,
                              }));
                            }}
                            type="checkbox"
                            checked={stateCheck.comment}
                          />
                        </div>
                        <span>Comment</span>
                      </div>
                      <div className={cx("check-box-content")}>
                        <div className={cx("check-box-item")}>
                          <div
                            style={{
                              backgroundColor: stateCheck.duet
                                ? null
                                : "transparent",
                            }}
                            className={cx("check-item")}
                          >
                            <svg
                              width="1.2rem"
                              height="1rem"
                              viewBox="0 0 10 8"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.88632 5.95189L8.77465 0.915431C8.96697 0.717276 9.28352 0.712552 9.48168 0.904878L9.67738 1.09483C9.87553 1.28715 9.88026 1.6037 9.68793 1.80185L4.34296 7.3088C4.093 7.56633 3.67963 7.56633 3.42967 7.3088L0.948335 4.75227C0.756009 4.55411 0.760734 4.23757 0.958888 4.04524L1.15459 3.85529C1.35275 3.66297 1.66929 3.66769 1.86162 3.86584L3.88632 5.95189Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>

                          <input
                            onChange={(e) => {
                              setStateCheck((prev) => ({
                                ...prev,
                                duet: !prev.duet,
                              }));
                            }}
                            type="checkbox"
                            checked={stateCheck.duet}
                          />
                        </div>
                        <span>Duet</span>
                      </div>
                      <div className={cx("check-box-content")}>
                        <div className={cx("check-box-item")}>
                          <div
                            style={{
                              backgroundColor: stateCheck.stitch
                                ? null
                                : "transparent",
                            }}
                            className={cx("check-item")}
                          >
                            <svg
                              width="1.2rem"
                              height="1rem"
                              viewBox="0 0 10 8"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.88632 5.95189L8.77465 0.915431C8.96697 0.717276 9.28352 0.712552 9.48168 0.904878L9.67738 1.09483C9.87553 1.28715 9.88026 1.6037 9.68793 1.80185L4.34296 7.3088C4.093 7.56633 3.67963 7.56633 3.42967 7.3088L0.948335 4.75227C0.756009 4.55411 0.760734 4.23757 0.958888 4.04524L1.15459 3.85529C1.35275 3.66297 1.66929 3.66769 1.86162 3.86584L3.88632 5.95189Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>

                          <input
                            checked={stateCheck.stitch}
                            onChange={(e) => {
                              setStateCheck((prev) => ({
                                ...prev,
                                stitch: !prev.stitch,
                              }));
                            }}
                            type="checkbox"
                          />
                        </div>
                        <span>Stitch</span>
                      </div>
                    </div>

                    <div className={cx("submit-button")}>
                      <Button
                        onClick={() => setModal(true)}
                        outline
                        className={cx("discard-btn")}
                      >
                        {t("Discard")}
                      </Button>
                      <Button
                        onClick={() => {
                          if (!loading) {
                            setLoading(true);
                            let formdata = new FormData();
                            formdata.append("description", nameFile);
                            formdata.append("upload_file", file);
                            formdata.append(
                              "thumbnail_time",
                              thumbnailRef.current.currentTime.toFixed(0)
                            );
                            formdata.append("music", `${nameMusic}`);
                            formdata.append("viewable", selected.toLowerCase());
                            for (let key in stateCheck) {
                              if (stateCheck[key]) {
                                formdata.append("allows[]", `${key}`);
                              }
                            }
                            request
                              .post("/videos", formdata, {
                                headers: {
                                  Authorization: `Bearer ${Cookies.get(
                                    "access_token"
                                  )}`,
                                },
                              })
                              .then(() => {
                                setLoading(false);
                                navigate(`/@${currentUser.nickname}`);
                                toast.success("Đăng tải video thành công!");
                              })
                              .catch((err) => {
                                setLoading(false);
                                toast.error("Có lỗi xảy ra, vui lòng thử lại!");
                              });
                          }
                        }}
                        primary
                        className="post-btn"
                      >
                        {loading ? (
                          <motion.div
                            style={{ height: "16px" }}
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <FontAwesomeIcon icon={faSpinner} />
                          </motion.div>
                        ) : (
                          t("Post")
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={cx("container")}>
          <input
            ref={inputRef}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setSrcVideo(URL.createObjectURL(e.target.files[0]));
              setNameFile(e.target.files[0].name);
            }}
            hidden
            type="file"
            accept="video/*"
            id="input-file"
          />

          <label htmlFor="input-file" className={cx("content")}>
            {dark ? (
              <img src={svg.uploadLight} alt="icon" />
            ) : (
              <img src={svg.upload} alt="icon" />
            )}
            <span className={cx("title")}>{t("Select video to upload")}</span>
            <span className={cx("info")}>{t("Or drag and drop a file")}</span>
            <span className={cx("info")}>
              {t(
                "Long videos can be split into multiple parts to get more exposure"
              )}
            </span>
            <div className={cx("info-video")}>
              <span>MP4 or WebM</span>
              <span>{t("720x1280 resolution or higher")}</span>
              <span>{t("Up to 30 minutes")}</span>
              <span>{t("Less than 2 GB")}</span>
            </div>

            <button
              onClick={() => {
                inputRef.current.click();
              }}
              className={cx("button")}
            >
              <span>Select file</span>
            </button>
          </label>
        </div>
      )}
    </div>
  );
};

export default Upload;

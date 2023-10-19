import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import noImage from '../../assests/png/noImage.jpg';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import svg from '../../assests/svg';
import { changeMuted, changeVolume } from '../../redux/volumeSlice';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import request from '../../ultis/request';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { faL } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading';

const cx = classNames.bind(styles);

const Video = ({ data, muted, followed,isLike, volumeValue }) => {
    const { t } = useTranslation();
    const imgRef = useRef();
    const navigate = useNavigate();
    const videoRef = useRef();
    const dispatch = useDispatch();
    const inputRef = useRef();
    const dark = useSelector((state) => state.theme.dark);
    const [isPlaying, setIsPlaying] = useState(false);
    const user = useSelector((state) => state.auth.login.success);
    const [dataVideo, setDataVideo] = useState(data);
    const [like, setLike] = useState(isLike);
    const [isFollowed, setIsFollowed] = useState(followed);
    const videoControlRef = useRef();
    const videoPlayerRef = useRef();
    const [loading, setLoading] = useState(true);

    const heartRef = useRef();
    const containerVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
    };

    const handleClick = () => {
        navigate(`/@${data.user.nickname}/video/${data.id}`);
    };

    const handleChange = (e) => {
        dispatch(changeVolume(e.target.value));

        if (e.target.value > 0) {
            dispatch(changeMuted(false));
            videoRef.current.volume = volumeValue / 100;
        } else {
            dispatch(changeMuted(true));
            videoRef.current.volume = 0;
        }
    };

    const handleFollow = () => {
        if (!user) {
            navigate('/login');
            toast.error('Vui lòng đăng nhập!');
            return;
        }
        if (!isFollowed) {
            request
                .post(`/users/${dataVideo.user.id}/follow`, null, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                    },
                })
                .catch();
        } else {
            request
                .post(`/users/${dataVideo.user.id}/unfollow`, null, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                    },
                })
                .catch();
        }
        setIsFollowed(!isFollowed);
    };

    const handleChangeVolume = (e) => {
        e.stopPropagation();
        if (muted) {
            dispatch(changeMuted(false));
            dispatch(changeVolume(31));
        } else {
            dispatch(changeMuted(true));
            dispatch(changeVolume(0));
        }
    };

    const handlePlayVideoInView = useCallback(() => {
        
        const video = videoRef.current;
        const bounding = videoRef.current.getBoundingClientRect();

        if (
            bounding.top >= -140 &&
            bounding.left >= 0 &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100
        ) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, []);

    useEffect(() => {
        const videoElement = videoRef.current;

        videoElement.addEventListener('canplaythrough', () => {
            setLoading(false);
        });

        return () => {
            videoElement.removeEventListener('canplaythrough', () => {
                setLoading(false);
            });
        };
    }, []);

    useEffect(() => {
        if (muted) {
            videoRef.current.volume = 0;
        } else {
            videoRef.current.volume = volumeValue / 100;
        }
    });

    useEffect(() => {
        setLike(isLike);
    }, [isLike]);

    useEffect(() => {
        setIsFollowed(followed);
    }, [followed]);

    useEffect(() => {
        window.addEventListener('scroll', handlePlayVideoInView);
        return () => window.removeEventListener('scroll', handlePlayVideoInView);
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('avatar')}
                onClick={() => {
                    navigate(`/@${dataVideo?.user.nickname}`);
                }}
            >
                <img
                    ref={imgRef}
                    src={dataVideo?.user.avatar}
                    alt="icon"
                    onError={() => {
                        imgRef.current.src = noImage;
                    }}
                />
            </div>

            <div className={cx('content')}>
                <div className={cx('user-info')}>
                    <div className={cx('title')}>
                        <h3
                            onClick={() => {
                                navigate(`/@${dataVideo?.user.nickname}`);
                            }}
                            className={cx('nick-name')}
                        >
                            {dataVideo.user.nickname}
                        </h3>
                        <h4 className={cx('full-name')}>
                            {dataVideo.user.first_name + ' ' + dataVideo.user.last_name}{' '}
                        </h4>
                    </div>
                    <div className={cx('description')}>
                        <span>{dataVideo.description}</span>
                    </div>
                    <div className={cx('music-info')}>
                        {dark ? <img src={svg.musicLight} alt="icon" /> : <img src={svg.music} alt="icon" />}
                        <div className={cx('name-music')}>
                            {!!dataVideo.music ? dataVideo.music : 'Âm thanh trong video!'}
                        </div>
                    </div>
                </div>

                <div className={cx('video-content')}>
                    <div ref={videoPlayerRef} onClick={handleClick} className={cx('video-player')}>
                        {loading ? (
                            <Loading/>
                        ) : (
                            <></>
                        )}
                        <div ref={videoControlRef} className={cx('video-control')}>
                            <img src={dataVideo.thumb_url} alt="icon" />
                            <video muted={muted} ref={videoRef} className={cx('video')} loop>
                                <source src={dataVideo.file_url} />
                            </video>
                            <div className={cx('volume-btn')}>
                                <div onClick={(e) => e.stopPropagation()} className={cx('volume-range')}>
                                    <input
                                        onChange={handleChange}
                                        ref={inputRef}
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={volumeValue}
                                    />
                                </div>
                                <div onClick={handleChangeVolume} className={cx('volume-icon')}>
                                    {!muted ? <img src={svg.volume} alt="icon" /> : <img src={svg.muted} alt="icon" />}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isPlaying) {
                                    setIsPlaying(false);
                                    videoRef.current.pause();
                                } else {
                                    setIsPlaying(true);
                                    videoRef.current.play();
                                }
                            }}
                            className={cx('video-controller')}
                        >
                            {!isPlaying ? (
                                <img src={svg.playVideo} alt="icon" />
                            ) : (
                                <img src={svg.pauseVideo} alt="icon" />
                            )}
                        </button>
                    </div>
                    <div className={cx('interact')}>
                        <span>
                            <button
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login');
                                        toast.error('Vui lòng đăng nhập!');
                                    } else {
                                        if (!like) {
                                            setLike(true);
                                            setDataVideo((prev) => ({
                                                ...prev,
                                                is_liked: true,
                                                likes_count: prev.likes_count + 1,
                                            }));

                                            request.post(
                                                `/videos/${dataVideo.id}/like`,
                                                null,

                                                {
                                                    headers: {
                                                        Authorization: 'Bearer ' + Cookies.get('access_token'),
                                                    },
                                                },
                                            );
                                        } else {
                                            setLike(false);
                                            setDataVideo((prev) => ({
                                                ...prev,
                                                likes_count: prev.likes_count - 1,
                                                is_liked: false,
                                            }));
                                            request.post(`/videos/${dataVideo.id}/unlike`, null, {
                                                headers: {
                                                    Authorization: 'Bearer ' + Cookies.get('access_token'),
                                                },
                                            });
                                        }
                                    }
                                }}
                                className={cx('interact-btn')}
                            >
                                {like ? (
                                    <div>
                                        <motion.div
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            initial="hidden"
                                            animate="visible"
                                            variants={containerVariants}
                                        >
                                            <img className={cx('heart-active')} src={svg.heartActive} alt="icon" />
                                        </motion.div>
                                    </div>
                                ) : dark ? (
                                    <img ref={heartRef} src={svg.heartLight} alt="icon" />
                                ) : (
                                    <img ref={heartRef} src={svg.heart} alt="icon" />
                                )}
                            </button>
                            <strong>{dataVideo.likes_count}</strong>
                        </span>
                        <span>
                            <button
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login');
                                        toast.error('Vui lòng đăng nhập!');
                                    } else {
                                        navigate(`/@${dataVideo.user.nickname}/video/${dataVideo.id}`);
                                    }
                                }}
                                className={cx('interact-btn')}
                            >
                                {dark ? (
                                    <img src={svg.commentLight} alt="icon" />
                                ) : (
                                    <img src={svg.comment} alt="icon" />
                                )}
                            </button>
                            <strong>{dataVideo.comments_count}</strong>
                        </span>
                        <span>
                            <button
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login');
                                        toast.error('Vui lòng đăng nhập!');
                                    }
                                }}
                                className={cx('interact-btn')}
                            >
                                {dark ? <img src={svg.flagLight} alt="icon" /> : <img src={svg.flag} alt="icon" />}
                            </button>
                            <strong>{dataVideo.shares_count}</strong>
                        </span>
                        <span>
                            <button className={cx('interact-btn')}>
                                {dark ? <img src={svg.shareLight} alt="icon" /> : <img src={svg.share} alt="icon" />}
                            </button>
                            <strong>Share</strong>
                        </span>
                    </div>
                </div>
            </div>

            <Button onClick={handleFollow} outline className="follow-btn">
                {isFollowed ? t('Following') : t('Follow')}
            </Button>
        </div>
    );
};

export default Video;

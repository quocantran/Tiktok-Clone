import React from 'react';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faChevronDown,
    faChevronUp,
    faCircleCheck,
    faClose,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import svg from '../../assests/svg';
import { Fragment, useEffect, useRef, useState } from 'react';
import { changeMuted, changeVolume } from '../../redux/volumeSlice';
import request from '../../ultis/request';
import Cookies from 'js-cookie';
import noImage from '../../assests/png/noImage.jpg';
import Button from '../../components/Button';
import { useTranslation } from 'react-i18next';
import CommentItem from './CommentItem';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import * as userService from '../../apiServices/userService';
import { useSwipeable } from 'react-swipeable';

const cx = classNames.bind(styles);

const TEMP_TOKEN =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90aWt0b2suZnVsbHN0YWNrLmVkdS52blwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTY5ODMzNzU4MCwiZXhwIjoxNzAwOTI5NTgwLCJuYmYiOjE2OTgzMzc1ODAsImp0aSI6IlFwb0pOZHR6UUNJMWlzOUEiLCJzdWIiOjY0MDksInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.XFPPst36ljO4lpK4aJah8Js8VFSq_V8bpSJ_TplMByA';

const MIN_PAGE = 1;

const MAX_PAGE = 15;

const DEFAULT_TYPE = 'for-you';

const PAGE_COMMENT = 1;

const Comment = () => {
    const max = MAX_PAGE;
    const min = MIN_PAGE;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const [page, setPage] = useState(randomNum);
    const [pageComment, setPageComment] = useState(PAGE_COMMENT);
    const { id } = useParams();
    const [dataId, setDataId] = useState([Number(id)]);
    const nextBtn = useRef();
    const prevBtn = useRef();
    const [index, setIndex] = useState(0);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const postBtn = useRef();
    const imgRef = useRef();
    const muted = useSelector((state) => state.volume.muted);
    const [textInput, setTextInput] = useState('');
    const textRef = useRef();
    const { t } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);
    const dark = useSelector((state) => state.theme.dark);
    const [play, setPlay] = useState(true);
    const volumeValue = useSelector((state) => state.volume.value);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [commentData, setCommentData] = useState([]);
    const [maxPageComment, setMaxPageComment] = useState(PAGE_COMMENT);
    const navigate = useNavigate();
    const videoRef = useRef();
    const dispatch = useDispatch();
    const [like, setLike] = useState(data.is_liked);
    const auth = useSelector((state) => state.auth.login.success);
    const videoPlayerRef = useRef();
    const [closeModal, setCloseModal] = useState(true);
    const imgAvatar = useRef();
    const commentWrapperPc = useRef();

    const commentWrapperMobile = useRef(null);

    const [isFollowed, setIsFollowed] = useState(data.user?.is_followed);

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            if (eventData.dir === 'Up') {
                nextBtn.current.click();
            } else if (eventData.dir === 'Down' && index > 0) {
                prevBtn.current.click();
            }
        },
    });

    const handleLike = () => {
        if (!auth) {
            navigate('/login');
            toast.error('Vui lòng đăng nhập!');
            return;
        }
        if (!like) {
            setLike(true);

            setData((prev) => ({
                ...prev,
                likes_count: prev.likes_count + 1,
            }));
            request
                .post(`/videos/${data.id}/like`, null, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                    },
                })
                
        } else {
            setLike(false);
            
            setData((prev) => ({
                ...prev,
                likes_count: prev.likes_count - 1,
            }));
            request.post(`/videos/${data.id}/unlike`, null, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            });
        }
    };

    const handleFollow = () => {
        if (!auth) {
            navigate('/login');
            toast.error('Vui lòng đăng nhập!');
            return;
        }
        if (isFollowed) {
            request.post(`/users/${data.user.id}/unfollow`, null, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            });
        } else {
            request.post(`/users/${data.user.id}/follow`, null, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            });
        }
        setIsFollowed(!isFollowed);
    };

    const handleClick = () => {
        if (play) {
            setPlay(false);
            videoRef.current.pause();
        } else {
            setPlay(true);
            videoRef.current.play();
        }
    };
    const handleChangeProgress = (e) => {
        const newTime = (e.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
    };

    const handleChangeVolume = () => {
        if (muted) {
            dispatch(changeMuted(false));
            dispatch(changeVolume(31));
        } else {
            dispatch(changeMuted(true));
            dispatch(changeVolume(0));
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        setLike(data.is_liked);
    }, [data.is_liked, index]);
    useEffect(() => {
        setPlay(true);
    }, [id]);

    useEffect(() => {
        setIsFollowed(data.user?.is_followed);
    }, [data.user?.is_followed]);

    useEffect(() => {
        async function getDataVideoIds() {
            try {
                const res = await userService.getContent({ type: DEFAULT_TYPE, page });

                res.data.forEach((data) => {
                    setDataId((prev) => [...prev, data.id]);
                });
            } catch (err) {}
        }
        getDataVideoIds();
    }, [page]);

    useEffect(() => {
        if (dataId[index] == dataId[dataId.length - 1]) {
            setPage((prev) => prev + 1);
        }
    }, [index]);

    useEffect(() => {
        if (commentWrapperPc.current) {
            const handleScroll = () => {
                const div = commentWrapperPc?.current;

                if (div) {
                    if (div.scrollTop + div.clientHeight >= div.scrollHeight && pageComment <= maxPageComment) {
                        setPageComment((prev) => prev + 1);
                    }
                }
            };

            commentWrapperPc.current?.addEventListener('scroll', handleScroll);

            return () => {
                commentWrapperPc.current?.removeEventListener('scroll', handleScroll);
            };
        }
    }, [pageComment]);

    useEffect(() => {
        if (!closeModal) {
            commentWrapperMobile.current = document.getElementById('comment-wrapper-mobile');
        } else {
            commentWrapperMobile.current = null;
        }

        if (commentWrapperMobile.current) {
            const handleScroll = () => {
                const div = commentWrapperMobile?.current;

                if (div) {
                    if (div.scrollTop + div.clientHeight >= div.scrollHeight && pageComment <= maxPageComment) {
                        setPageComment((prev) => prev + 1);
                    }
                }
            };

            commentWrapperMobile.current?.addEventListener('scroll', handleScroll);

            return () => {
                commentWrapperMobile.current?.removeEventListener('scroll', handleScroll);
            };
        }
    }, [closeModal, pageComment]);

    useEffect(() => {
        setLoading(true);
        request
            .get(`/videos/${id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            })
            .then((res) => {
                setData(res.data.data);
                setLoading(false);
            })
            .catch(() => {
                navigate(-1);
            });
    }, [index]);

    useEffect(() => {
        setPageComment(1);
        setCommentData([]);
    },[id])

    useEffect(() => {
        setPageComment(1);
        setCommentData([]);
    },[isMounted])

    useEffect(() => {
        request
            .get(`/videos/${id}}/comments`, {
                params: {
                    page: pageComment,
                },

                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token') || TEMP_TOKEN}`,
                },
            })
            .then((res) => {
                setCommentData((prev) => [...prev, ...res.data.data]);
                
                setMaxPageComment(res.data.meta.pagination.total_pages);
            })
            .catch((err) => console.log());
    }, [isMounted, id, pageComment]);

    

    useEffect(() => {
        const video = videoRef.current;

        function updateVideoTime() {
            const currentTime = (video.currentTime / video.duration) * 100;
            videoPlayerRef.current?.style.setProperty('--video-time', `${currentTime}%`);
            requestAnimationFrame(updateVideoTime);
        }

        video.addEventListener('play', () => {
            requestAnimationFrame(updateVideoTime);
        });

        return () => {
            video.removeEventListener('play', updateVideoTime);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;

        video.addEventListener('canplay', () => {
            setDuration(video.duration);
        });

        video.addEventListener('timeupdate', () => {
            setCurrentTime(video.currentTime);
        });
    }, []);

    useEffect(() => {
        if (muted) {
            videoRef.current.volume = 0;
        } else {
            videoRef.current.volume = volumeValue / 100;
        }
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('video-container')} {...handlers}>
                <div ref={videoPlayerRef} className={cx('video-player')}>
                    <div style={{ backgroundImage: `url(${data.thumb_url})` }} className={cx('video-background')}></div>
                    <div onClick={handleClick} className={cx('video-space')}>
                        <img className={cx('thumb')} src={data.thumb_url} />
                        <video
                            ref={videoRef}
                            className={cx('video')}
                            src={data.file_url}
                            muted={muted}
                            autoPlay
                            loop
                        ></video>
                        {loading ? <Loading className={cx('comment-video-loading')} /> : Fragment}
                    </div>
                    <button
                        onClick={() => {
                            navigate('/');
                        }}
                        className={cx('close-btn')}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <button
                        ref={nextBtn}
                        onClick={() => {
                            if (dataId[index]) {
                                let idxNext = index + 1;
                                navigate(`/all/video/${dataId[idxNext]}`);
                            }
                            setIndex((prev) => prev + 1);
                        }}
                        className={cx('next-btn')}
                    >
                        <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {index <= 0 ? (
                        Fragment
                    ) : (
                        <button
                            ref={prevBtn}
                            onClick={() => {
                                if (dataId[index]) {
                                    let idxPrev = index - 1;
                                    navigate(`/all/video/${dataId[idxPrev]}`);
                                }
                                setIndex((prev) => prev - 1);
                            }}
                            className={cx('prev-btn')}
                        >
                            <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                    )}

                    <div className={cx('progress-video')}>
                        <div className={cx('progress-video-player')}>
                            <div className={cx('progress-bar')}>
                                <div className={cx('progress-dot')}></div>
                            </div>
                            <input onChange={handleChangeProgress} type="range" min="0" max="100" step="1" />
                        </div>
                        <div className={cx('time-video')}>
                            <span>{formatTime(currentTime)}/</span>

                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {play ? (
                        Fragment
                    ) : (
                        <span className={cx('play-video')}>
                            <img src={svg.playVideo} alt="icon" />
                        </span>
                    )}

                    {muted ? (
                        <div className={cx('volume-content')}>
                            <div className={cx('volume-control')}>
                                <input
                                    onChange={(e) => {
                                        dispatch(changeVolume(e.target.value));

                                        if (e.target.value > 0) {
                                            dispatch(changeMuted(false));
                                            videoRef.current.volume = volumeValue / 100;
                                        } else {
                                            dispatch(changeMuted(true));
                                            videoRef.current.volume = 0;
                                        }
                                    }}
                                    className={cx('progress')}
                                    value={volumeValue}
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                />
                                <div style={{ padding: '4px' }}></div>
                            </div>
                            <button onClick={handleChangeVolume} className={cx('volume-btn')}>
                                <img src={svg.muted} alt="icon" />
                            </button>
                        </div>
                    ) : (
                        <div className={cx('volume-content')}>
                            <div className={cx('volume-control')}>
                                <input
                                    onChange={(e) => {
                                        dispatch(changeVolume(e.target.value));

                                        if (e.target.value > 0) {
                                            dispatch(changeMuted(false));
                                            videoRef.current.volume = volumeValue / 100;
                                        } else {
                                            dispatch(changeMuted(true));
                                            videoRef.current.volume = 0;
                                        }
                                    }}
                                    className={cx('progress')}
                                    value={volumeValue}
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                />
                                <div style={{ padding: '4px' }}></div>
                            </div>

                            <button onClick={handleChangeVolume} className={cx('volume-btn')}>
                                <img src={svg.volume} alt="icon" />
                            </button>
                        </div>
                    )}

                    <div className={cx('avatar-video')}>
                        <img
                            onClick={() => {
                                navigate(`/@${data.user?.nickname}`);
                            }}
                            ref={imgAvatar}
                            src={data.user?.avatar}
                            alt="avatar"
                            onError={() => {
                                imgAvatar.current.src = noImage;
                            }}
                        />
                    </div>
                    <div onClick={handleLike} className={cx('heart-video')}>
                        {like ? <img src={svg.heartActive} alt="icon" /> : <img src={svg.heartLight} alt="icon" />}
                        <span className="like-count-video">{data.likes_count}</span>
                    </div>
                    <div className={cx('comment-video')}>
                        <img
                            onClick={() => {
                                setCloseModal(false);
                            }}
                            src={svg.commentLight}
                            alt="icon"
                        />
                        <span className="like-count-video">{data.comments_count}</span>
                    </div>

                    <div className={cx('share-video-icon')}>
                        <img src={svg.shareLight} alt="icon" />
                        <span>{t('Share')}</span>
                    </div>

                    <div className={cx('follow-video-icon')}>
                        {isFollowed ? (
                            <FontAwesomeIcon onClick={handleFollow} icon={faCircleCheck} />
                        ) : (
                            <img onClick={handleFollow} src={svg.followMobile} alt="icon" />
                        )}
                    </div>

                    <div className={cx('info-video')}>
                        <div
                            onClick={() => {
                                navigate(`/@${data.user?.nickname}`);
                            }}
                            className={cx('nick-name-video')}
                        >
                            <strong>{data.user?.nickname}</strong>
                        </div>
                        <span className={cx('description-video')}>{data.description}</span>

                        <div className={cx('music-video')}>
                            <img src={svg.musicLight} alt="icon" />
                            <div className={cx('name-music')}>
                                <span>
                                    <p>{data.music ? data.music : 'Âm thanh trong video!'}</p>
                                    <p>{data.music ? data.music : 'Âm thanh trong video!'}</p>
                                    <p>{data.music ? data.music : 'Âm thanh trong video!'}</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('comment-container')}>
                <div className={cx('comment-header')}>
                    <header className={cx('user-info')}>
                        <div className={cx('user-wrapper')}>
                            <img
                                onClick={() => {
                                    navigate(`/@${data.user?.nickname}`);
                                }}
                                ref={imgRef}
                                src={data.user?.avatar}
                                onError={() => {
                                    imgRef.current.src = noImage;
                                }}
                            />
                            <div className={cx('info')}>
                                <p
                                    onClick={() => {
                                        navigate(`/@${data.user?.nickname}`);
                                    }}
                                    className={cx('nick-name')}
                                >
                                    {data.user?.nickname}
                                </p>
                                <p className={cx('time-create')}>{data?.created_at}</p>
                            </div>
                        </div>

                        {dark ? (
                            <Button onClick={handleFollow} outline>
                                {isFollowed ? t('Following') : t('Follow')}
                            </Button>
                        ) : (
                            <Button onClick={handleFollow} primary>
                                {isFollowed ? t('Following') : t('Follow')}
                            </Button>
                        )}
                    </header>
                    <p className={cx('description')}>{data.description}</p>
                    <div className={cx('music')}>
                        {dark ? <img src={svg.musicLight} alt="icon" /> : <img src={svg.music} alt="icon" />}
                        <p>{data.music ? data.music : 'Âm thanh trong video!'}</p>
                    </div>
                </div>
                <div className={cx('interact-content')}>
                    <div className={cx('interact-container')}>
                        {like ? (
                            <div className={cx('interact-btn')}>
                                <button onClick={handleLike}>
                                    <img src={svg.heartActive} alt="icon" />
                                </button>
                                <strong>{data.likes_count}</strong>
                            </div>
                        ) : dark ? (
                            <div className={cx('interact-btn')}>
                                <button onClick={handleLike}>
                                    <img src={svg.heartLight} alt="icon" />
                                </button>
                                <strong>{data.likes_count}</strong>
                            </div>
                        ) : (
                            <div className={cx('interact-btn')}>
                                <button onClick={handleLike}>
                                    <img src={svg.heart} alt="icon" />
                                </button>
                                <strong>{data.likes_count}</strong>
                            </div>
                        )}
                        {dark ? (
                            <div className={cx('interact-btn')}>
                                <button>
                                    <img src={svg.commentLight} alt="icon" />
                                </button>
                                <strong>{data.comments_count}</strong>
                            </div>
                        ) : (
                            <div className={cx('interact-btn')}>
                                <button>
                                    <img src={svg.comment} alt="icon" />
                                </button>
                                <strong>{data.comments_count}</strong>
                            </div>
                        )}
                        {dark ? (
                            <div className={cx('interact-btn')}>
                                <button>
                                    <img src={svg.flagLight} alt="icon" />
                                </button>
                                <strong>{data.shares_count}</strong>
                            </div>
                        ) : (
                            <div className={cx('interact-btn')}>
                                <button>
                                    <img src={svg.flag} alt="icon" />
                                </button>
                                <strong>{data.shares_count}</strong>
                            </div>
                        )}

                        <div className={cx('social-btn')}>
                            <img src={svg.embed} alt="icon" />
                            <img src={svg.friend} alt="icon" />
                            <img src={svg.facebook} alt="icon" />
                            <img src={svg.whatsapp} alt="icon" />
                            <img src={svg.twitter} alt="icon" />
                            {dark ? <img src={svg.shareLight} alt="icon" /> : <img src={svg.share} alt="icon" />}
                        </div>
                    </div>
                    <div className={cx('link')}>
                        <p ref={textRef} className={cx('link-location')}>
                            {window.location.href}
                        </p>
                        <button
                            onClick={() => {
                                const textToCoppy = textRef.current.innerText;
                                navigator.clipboard.writeText(textToCoppy).then(() => {
                                    alert('Coppied');
                                });
                            }}
                            className={cx('coppy-link')}
                        >
                            {t('Coppy')}
                        </button>
                    </div>
                </div>
                <div ref={commentWrapperPc} className={cx('comment-wrapper')}>
                    {commentData.map((item) => {
                        return <CommentItem key={item.id} data={item} />;
                    })}
                </div>
                <footer className={cx('post-comment')}>
                    <div className={cx('post-wrapper')}>
                        {!auth ? (
                            <p
                                onClick={() => {
                                    navigate('/login');
                                }}
                                className={cx('notification')}
                            >
                                Login to comment!
                            </p>
                        ) : (
                            <div className={cx('post-create')}>
                                <div className={cx('input-post')}>
                                    <textarea
                                        value={textInput}
                                        onChange={(e) => {
                                            setTextInput(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                if (textInput.trim() !== '') {
                                                    e.preventDefault();
                                                    postBtn.current.click();
                                                }
                                            }
                                        }}
                                        rows="1"
                                        placeholder={`${t('Comments')}...`}
                                        spellCheck={false}
                                    />
                                </div>

                                {textInput.trim().length > 0 ? (
                                    <button
                                        ref={postBtn}
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                comments_count: prev.comments_count + 1,
                                            }));
                                            request
                                                .post(
                                                    `/videos/${data.id}/comments`,
                                                    {
                                                        comment: textInput,
                                                    },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${Cookies.get('access_token')}`,
                                                        },
                                                    },
                                                )
                                                .then(() => {
                                                    setTextInput('');
                                                    setIsMounted(!isMounted);
                                                    toast.success('Đăng thành công!');
                                                })
                                                .catch((err) => console.log(err));
                                        }}
                                        className={cx('new-comment-active')}
                                    >
                                        <span>{t('Post')}</span>
                                    </button>
                                ) : (
                                    <button className={cx('new-comment')}>
                                        <span>{t('Post')}</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </footer>
            </div>

            {closeModal ? (
                <Fragment />
            ) : loading ? (
                <Fragment></Fragment>
            ) : (
                <div
                    onClick={(e) => {
                        setCloseModal(true);
                    }}
                    className={cx('comment-mobile')}
                >
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className={cx('comment-mobile-container')}
                    >
                        <div onClick={() => setCloseModal(true)} className={cx('close-icon-mobile')}>
                            <FontAwesomeIcon icon={faClose} />
                        </div>
                        <header className={cx('comment-header-mobile')}>{`${data.comments_count} bình luận`}</header>

                        <div id = 'comment-wrapper-mobile' ref={commentWrapperMobile} className={cx('comment-items-mobile')}>
                            {commentData.map((item) => {
                                return <CommentItem key={item.id} data={item} />;
                            })}
                        </div>

                        <footer className={cx('post-comment')}>
                            <div className={cx('post-wrapper')}>
                                {!auth ? (
                                    <p
                                        onClick={() => {
                                            navigate('/login');
                                        }}
                                        className={cx('notification')}
                                    >
                                        Login to comment!
                                    </p>
                                ) : (
                                    <div className={cx('post-create')}>
                                        <div className={cx('input-post')}>
                                            <textarea
                                                value={textInput}
                                                onChange={(e) => {
                                                    setTextInput(e.target.value);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        if (textInput.trim() !== '') {
                                                            e.preventDefault();
                                                            postBtn.current.click();
                                                        }
                                                    }
                                                }}
                                                rows="1"
                                                placeholder={`${t('Comments')}...`}
                                                spellCheck={false}
                                            ></textarea>
                                        </div>

                                        {textInput.trim().length > 0 ? (
                                            <button
                                                ref={postBtn}
                                                onClick={() => {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        comments_count: prev.comments_count + 1,
                                                    }));
                                                    request
                                                        .post(
                                                            `/videos/${data.id}/comments`,
                                                            {
                                                                comment: textInput,
                                                            },
                                                            {
                                                                headers: {
                                                                    Authorization: `Bearer ${Cookies.get(
                                                                        'access_token',
                                                                    )}`,
                                                                },
                                                            },
                                                        )
                                                        .then(() => {
                                                            setTextInput('');
                                                            setIsMounted(!isMounted);
                                                            toast.success('Đăng thành công!');
                                                        })
                                                        .catch((err) => console.log(err));
                                                }}
                                                className={cx('new-comment-active')}
                                            >
                                                <span>{t('Post')}</span>
                                            </button>
                                        ) : (
                                            <button className={cx('new-comment')}>
                                                <span>{t('Post')}</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comment;

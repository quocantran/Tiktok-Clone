import classNames from 'classnames/bind';
import styles from '../../Following/Following.module.scss';
import { Fragment, useEffect, useRef, useState } from 'react';
import Button from '../../../components/Button';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import noImage from '../../../assests/png/noImage.jpg';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const SuggestUser = ({ data, idx, index, setIndex }) => {
    const videoRef = useRef();
    const { t } = useTranslation();
    const imgRef = useRef();
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const videoElement = videoRef.current;

        videoElement.addEventListener('canplaythrough', () => {
            setIsVideoLoaded(true);
        });

        return () => {
            videoElement.removeEventListener('canplaythrough', () => {
                setIsVideoLoaded(true);
            });
        };
    }, []);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (isVideoLoaded && idx == index) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }, [isVideoLoaded, idx, index]);

    return (
        <div
            onMouseEnter={() => {
                setIndex(idx);
            }}
            onClick={() => {
                videoRef.current.pause();
            }}
            className={cx('suggest-wrapper')}
        >
            <div className={cx('suggest-item-wrapper')}>
                <a className={cx('suggest-item')} target="blank" href={`/@${data.nickname}`}>
                    <div className={cx('video-preview')}>
                        <div className={cx('video-inner')}>
                            <img src={data.popular_video.thumb_url} />
                            <video ref={videoRef} src={data.popular_video.file_url} loop muted />
                        </div>
                        <div className={cx('suggest-info')}>
                            <img
                                src={data.avatar}
                                alt="icon"
                                ref={imgRef}
                                onError={() => {
                                    imgRef.current.src = noImage;
                                }}
                            />
                            <h2 className={cx('full-name')}>{data.first_name + ' ' + data.last_name}</h2>
                            <h4 className={cx('nick-name')}>
                                {data.nickname}
                                {data.tick ? (
                                    <div className={cx('tick-icon')}>
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                    </div>
                                ) : (
                                    Fragment
                                )}
                            </h4>
                            <Button onClick={() => {
                                navigate('/login');
                            }} primary className={cx('button-following')}>
                                {t('Follow')}
                            </Button>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default SuggestUser;

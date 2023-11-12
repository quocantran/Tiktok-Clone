import classNames from 'classnames/bind';
import styles from '../../Profile/Profile.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const VideoProfile = ({ index, setIndex, data, idx }) => {
    const videoRef = useRef();
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const imgRef = useRef();
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
        if (videoRef.current.offsetWidth < 192) {
            videoRef.current.style.width = '100%';
            videoRef.current.style.height = 'auto';
            imgRef.current.style.width = '100%';
        }
    }, [isVideoLoaded]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (isVideoLoaded && idx == index) {
            videoElement.play();
        } else {
            videoElement.currentTime = 0;
            videoElement.pause();
        }
    }, [isVideoLoaded, idx, index]);

    return (
        <div className={cx('video-item')}>
            <div className={cx('item')}>
                <div className={cx('item-content')}>
                    <div
                        onClick={() => {
                            navigate(`/all/video/${data.id}`);
                        }}
                        className={cx('video-wrapper')}
                    >
                        <div
                            onMouseEnter={() => {
                                setIndex(idx);
                            }}
                            className={cx('video-inner')}
                        >
                            <img ref={imgRef} src={data.thumb_url} alt="icon" />
                            <video ref={videoRef} src={data.file_url} loop muted={true} />
                        </div>
                    </div>
                </div>
            </div>
            <p className={cx('description')}>{data.description}</p>
        </div>
    );
};

export default VideoProfile;

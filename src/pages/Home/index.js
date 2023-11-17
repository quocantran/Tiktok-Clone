import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useSelector } from 'react-redux';
import { Fragment, useCallback, useEffect, useState } from 'react';
import * as userService from '../../apiServices/userService';
import ContentHomeItem from './ContentHomeItem';
import svg from '../../assests/svg';

const cx = classNames.bind(styles);

const DEFAULT_TYPE = 'for-you';
const MIN_PAGE = 1;
const MAX_PAGE = 5;

const Home = () => {
    const max = MAX_PAGE;
    const min = MIN_PAGE;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const [contentData, setContentData] = useState([]);
    const [hideBtn, setHideBtn] = useState(true);
    const muted = useSelector((state) => state.volume.muted);
    const volumeValue = useSelector((state) => state.volume.value);
    const [page, setPage] = useState(randomNum);

    useEffect(() => {
        async function getContent() {
            const res = await userService.getContent({ type: DEFAULT_TYPE, page });
            setContentData((prev) => [...prev, ...res.data]);
        }
        getContent();
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = useCallback(() => {
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
            setPage((page) => page + 1);
        }
        if (window.scrollY >= 100) {
            setHideBtn(false);
        } else {
            setHideBtn(true);
        }
    });

    const handeScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {contentData.map((item, idx) => {
                    return <ContentHomeItem muted={muted} volumeValue={volumeValue} key={idx} data={item} />;
                })}
            </div>

            {hideBtn ? (
                Fragment
            ) : (
                <div onClick={handeScrollToTop} className={cx('scroll-to-top')}>
                    <img src={svg.scrollToTop} alt="icon" />
                </div>
            )}
        </div>
    );
};

export default Home;

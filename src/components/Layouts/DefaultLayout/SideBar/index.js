import Menu from './Menu';
import MenuItems from './MenuItems';
import styles from './SideBar.module.scss';
import classNames from 'classnames/bind';
import svg from '../../../../assests/svg';
import { useTranslation } from 'react-i18next';
import SuggestAccount from './SuggestAccount';
import * as userService from '../../../../apiServices/userService';
import { Fragment, useEffect, useState } from 'react';
import effectBackground from '../../../../assests/png/effectBackground.png';
import effectBackgroundDark from '../../../../assests/png/effectBackgroundDark.png';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const PER_PAGE = 5;
const PAGE_FOLLOWING = 1;
const SideBar = () => {
    const { t } = useTranslation();
    const max = 10;
    const min = 1;
    const [userData, setUserData] = useState([]);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const [page, setPage] = useState(randomNumber);
    const dark = useSelector((state) => state.theme.dark);
    const [followingData, setFollowingData] = useState([]);
    const isAuth = useSelector((state) => state.auth.login.success);

    const [pageFollowing, setPageFollowing] = useState(PAGE_FOLLOWING);

    useEffect(() => {
        async function getData() {
            try {
                const res = await userService.getSuggest({ page, perPage: PER_PAGE });
                setUserData((prev) => [...prev, ...res.data]);
            } catch (err) {}
        }
        getData();
    }, [page]);

    useEffect(() => {
        async function getFollowing() {
            try {
                const res = await userService.getFollowing({ page: pageFollowing });
                if (res) setFollowingData((prev) => [...prev, ...res.data]);
            } catch (err) {}
        }
        getFollowing();
    }, [pageFollowing]);

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };
    const handleSeeLess = () => {
        const newData = userData.slice(0, 5);
        setUserData(newData);
    };

    const handleSeeMoreFollowing = () => {
        setPageFollowing((prev) => prev + 1);
    };
    const handleSeeLessFollowing = () => {
        if (followingData.length > 5) {
            const newData = followingData.slice(0, 5);
            setFollowingData(newData);
        }
    };
    

    return (
        <div className={cx('wrapper')}>
            <Menu>
                <MenuItems
                    title={t('For You')}
                    to="/"
                    icon={dark ? svg.homeLight : svg.home}
                    activeIcon={svg.homeActive}
                ></MenuItems>
                <MenuItems
                    title={t('Following')}
                    to="/following"
                    icon={dark ? svg.followingLight : svg.following}
                    activeIcon={svg.followingActive}
                ></MenuItems>
                <MenuItems
                    title={t('Explore')}
                    to="/explore"
                    icon={dark ? svg.exploreLight : svg.explore}
                    flag
                    activeIcon={svg.exploreActive}
                ></MenuItems>
                <MenuItems
                    title="LIVE"
                    to="/live"
                    icon={dark ? svg.liveLight : svg.live}
                    activeIcon={svg.liveActive}
                ></MenuItems>
            </Menu>

            <SuggestAccount
                data={userData}
                label="Suggested Account"
                onSeeMore={handleSeeMore}
                onSeeLess={handleSeeLess}
            />
            {!isAuth ? (
                Fragment
            ) : (
                followingData.length > 0 ? <SuggestAccount
                    data={followingData}
                    label="Following accounts"
                    onSeeMore={handleSeeMoreFollowing}
                    onSeeLess={handleSeeLessFollowing}
                />:Fragment
            )}

            <div className={cx('footer-sidebar')}>
                <a className={cx('effect-link')} href="https://effecthouse.tiktok.com" target="blank">
                    {dark ? (
                        <img className={cx('back-ground')} src={effectBackgroundDark} alt="icon" />
                    ) : (
                        <img className={cx('back-ground')} src={effectBackground} alt="icon" />
                    )}
                    <div className={cx('effect-title')}>
                        {dark ? <img src={svg.effectLight} alt="icon" /> : <img src={svg.effect} alt="icon" />}
                        <h4>Create effects</h4>
                    </div>
                </a>
                <div className={cx('div-link')}>
                    <a href="/">About</a>
                    <a href="/">Newsroom</a>
                    <a href="/">Contact</a>
                    <a href="/">Careers</a>
                </div>
                <div className={cx('div-link')}>
                    <a href="/">TikTok for Good</a>
                    <a href="/">Advertise</a>
                    <a href="/">Developers</a>
                    <a href="/">Transparency</a>
                    <a href="/">TikTok Rewards</a>
                    <a href="/">TikTok embeds</a>
                </div>
                <div className={cx('div-link')}>
                    <a href="/">Help</a>
                    <a href="/">Safety</a>
                    <a href="/">Terms</a>
                    <a href="/">Privacy</a>
                    <a href="/">Creator Portal</a>
                    <a href="/">Community Guidelines</a>
                </div>
                <span>© 2023 TikTok</span>
            </div>
        </div>
    );
};

export default SideBar;

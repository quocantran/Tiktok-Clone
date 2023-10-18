import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import svg from '../../../../assests/svg/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleRight,
    faArrowRightFromBracket,
    faCirclePlay,
    faCircleQuestion,
    faEllipsisVertical,
    faKeyboard,
    faLanguage,
    faMoon,
    faPlus,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import DefaultTippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useEffect, useRef, useState } from 'react';
import { Wrapper as PopperWrapper } from '../../../Popper';

import Button from '../../../Button';
import Menu from '../../../Popper/Menu';
import { useTranslation } from 'react-i18next';
import noImg from '../../../../assests/png/noImage.jpg';

import Search from '../Search';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import request from '../../../../ultis/request';
import Cookies from 'js-cookie';
import verifyUser from '../../../../apiServices/verifyUser';

const cx = classNames.bind(styles);

const Header = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [user, setUser] = useState();
    const language = useSelector((state) => state.language.languageDefault);
    const dark = useSelector((state) => state.theme.dark);
    const imgRef = useRef();

    useEffect(() => {
        verifyUser()
            .then((res) => setUser(res?.data));
        
    }, []);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faCirclePlay} />,
            title: 'LIVE Creator Hub',
        },
        {
            icon: <FontAwesomeIcon icon={faLanguage} />,
            title: t('Language'),
            children: {
                title: t('Language'),
                data: [
                    {
                        code: 'en',
                        title: 'English',
                    },
                    {
                        code: 'vi',
                        title: 'Tiếng Việt (Việt Nam)',
                    },
                ],
            },
        },
        {
            icon: <FontAwesomeIcon icon={faCircleQuestion} />,
            title: 'Feedback and help',
            to: '/feedback',
        },
        {
            icon: <FontAwesomeIcon icon={faKeyboard} />,
            title: 'Keyboard shortcuts',
        },
        {
            icon: <FontAwesomeIcon icon={faMoon} />,
            title: 'Dark mode',
            mode: true,
        },
    ];

    const USER_ITEMS = [
        {
            icon : <FontAwesomeIcon icon={faUser}/>,
            title : t('View profile'),
            profile : true,
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            title: t('Log out'),
            onLogOut: true,
            separate: true,
        },
    ];

    
    return (
        <header className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('logo')}>
                    <Link className={cx('icon')} to="/">
                        {dark ? (
                            <img style={{ marginTop: '10px' }} src={svg.logoWhite} alt="tiktok" />
                        ) : (
                            <img src={svg.logo} alt="tiktok"></img>
                        )}
                    </Link>
                </div>
                <Search />

                {user ? (
                    <div className={cx('actions')}>
                        <a href="/upload" className={cx('upload-btn-user')}>
                            <div className={cx('plus-icon')}>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                            <span>{t('Upload')}</span>
                        </a>

                        <div>
                            <Tippy
                                interactive
                                delay={[0, 500]}
                                render={(attrs) => (
                                    <PopperWrapper download>
                                        {dark ? (
                                            <img
                                                className={cx('download-icon-tiktok')}
                                                src={svg.downloadIconLight}
                                                alt="icon"
                                            />
                                        ) : (
                                            <img className={cx('download-icon-tiktok')} src={svg.download} alt="icon" />
                                        )}
                                        <p className={cx('title-download')}>{t('TikTok desktop app')}</p>
                                        <Button primary download>
                                            {t('Download')}
                                        </Button>
                                        <p className={cx('mobile-app')}>
                                            {t('Download mobile app instead')}
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </p>
                                    </PopperWrapper>
                                )}
                            >
                                <div className={cx('download-icon-user')}>
                                    {dark ? (
                                        <img src={svg.desktopLight} alt="icon" />
                                    ) : (
                                        <img src={svg.desktop} alt="icon" />
                                    )}
                                </div>
                            </Tippy>
                        </div>
                        <div>
                            <DefaultTippy content={t('Messages')} placement="bottom" delay={[0, 100]} interactive>
                                <div className={cx('message-icon')}>
                                    {dark ? (
                                        <img src={svg.messageLight} alt="icon" />
                                    ) : (
                                        <img src={svg.message} alt="icon" />
                                    )}
                                </div>
                            </DefaultTippy>
                        </div>
                        <div>
                            <DefaultTippy interactive delay={[0, 100]} content={t('Inbox')} placement="bottom">
                                <div className={cx('inbox-icon')}>
                                    {dark ? (
                                        <img src={svg.inboxLight} alt="icon" />
                                    ) : (
                                        <img src={svg.inbox} alt="icon" />
                                    )}
                                </div>
                            </DefaultTippy>
                        </div>
                        <Menu items={USER_ITEMS}>
                            <div className={cx('user-icon')}>
                                <img
                                    ref={imgRef}
                                    onError={() => {
                                        imgRef.current.src = noImg;
                                    }}
                                    src={user.avatar}
                                    alt="icon"
                                />
                            </div>
                        </Menu>
                    </div>
                ) : (
                    <div className={cx('actions')}>
                        <a href="/upload" className={cx('upload-btn')}>
                            <div className={cx('plus-icon')}>
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                            <span>{t('Upload')}</span>
                        </a>

                        <Button to="/login" primary>
                            {t('Log in')}
                        </Button>
                        <div>
                            <Tippy
                                interactive
                                delay={[0, 500]}
                                render={(attrs) => (
                                    <PopperWrapper download>
                                        {dark ? (
                                            <img
                                                className={cx('download-icon-tiktok')}
                                                src={svg.downloadIconLight}
                                                alt="icon"
                                            />
                                        ) : (
                                            <img className={cx('download-icon-tiktok')} src={svg.download} alt="icon" />
                                        )}
                                        <p className={cx('title-download')}>{t('TikTok desktop app')}</p>
                                        <Button primary download>
                                            {t('Download')}
                                        </Button>
                                        <p className={cx('mobile-app')}>
                                            {t('Download mobile app instead')}
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </p>
                                    </PopperWrapper>
                                )}
                            >
                                <div className={cx('download-icon')}>
                                    {dark ? (
                                        <img src={svg.desktopLight} alt="icon" />
                                    ) : (
                                        <img src={svg.desktop} alt="icon" />
                                    )}
                                </div>
                            </Tippy>
                        </div>
                        <Menu items={MENU_ITEMS}>
                            <div className={cx('menu-icon')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </div>
                        </Menu>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

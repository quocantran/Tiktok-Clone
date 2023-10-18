import { Wrapper as PopperWrapper } from '../../Popper';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import MenuItems from './MenuItems';
import Header from './Header';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from 'react-redux';

import { logoutSucces } from '../../../redux/authSlice';
import { changeLanguage } from '../../../redux/languageSlice';
import Cookies from 'js-cookie';
import request from '../../../ultis/request';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const Menu = ({ children, items = [] }) => {
    const { t } = useTranslation();
    const [menu, setMenu] = useState([{ data: items }]);
    const currentMenu = menu[menu.length - 1];
    const userNickname = useSelector(state => state.auth.currentUser.data?.nickname);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const renderItems = () => {
        return currentMenu.data.map((item, index) => {
            const isParentMenu = !!item.children;

            return (
                <MenuItems
                    key={index}
                    item={item}
                    onClick={() => {
                        if (isParentMenu) {
                            setMenu((prev) => [...prev, item.children]);
                        } else if (menu.length > 1) {
                            dispatch(changeLanguage(item.code));
                        }

                        if (item.onLogOut) {
                            const confirm = window.confirm(`${t('Are you sure you want to log out?')}`);
                            if (confirm) {
                                dispatch(logoutSucces());
                                Cookies.remove('access_token');
                                window.location.reload();
                            }
                        }
                        if(item.profile){
                            navigate(`/@${userNickname}`);
                        }
                    }}
                />
            );
        });
    };

    const handleBack = () => {
        setMenu((prev) => prev.slice(0, prev.length - 1));
    };

    return (
        <Tippy
            interactive
            delay={[0, 700]}
            hideOnClick={false}
            onHide={() => {
                setMenu((prev) => prev.slice(0, 1));
            }}
            render={(attrs) => (
                <div tabIndex={-1} className={cx('menu-container')}>
                    <PopperWrapper>
                        {menu.length > 1 ? <Header title={t('Language')} onBack={handleBack} /> : Fragment}

                        {renderItems()}
                    </PopperWrapper>
                </div>
            )}
        >
            {children}
        </Tippy>
    );
};

export default Menu;

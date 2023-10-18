import { Link } from 'react-router-dom';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../../redux/darkModeSlice';

const cx = classNames.bind(styles);

const MenuItems = ({ item, onClick }) => {
    let Comp = 'div';
    const { t } = useTranslation();
    const dark = useSelector(state => state.theme.dark);
    const dispatch = useDispatch();

    useEffect(() => {
        if(dark){
            document.body.classList.add(cx('dark'));
        }else{
            document.body.classList.remove(cx('dark'));
        }
    },[dark]);

    return (
        <Comp
            className={cx('wrapper', {
                separate: item.separate,
                mode: item.mode,
            })}
            to={item.to}
            onClick={onClick}
        >
            {!!item.icon ? <div className={cx('item-icon')}>{item.icon}</div> : Fragment}
            <span className={cx('title')}>{t(`${item.title}`)}</span>
            {item.mode ? (
                <div>
                    <input
                        hidden
                        id='input'
                        checked={dark}
                        className={cx('input')}
                        type="checkbox"
                        onChange={(e) => {
                            dispatch(setTheme(e.target.checked));
                        }}
                    />
                    <label className={cx('switch-mode')} htmlFor='input'></label>
                </div>
            ) : (
                Fragment
            )}
        </Comp>
    );
};

export default MenuItems;

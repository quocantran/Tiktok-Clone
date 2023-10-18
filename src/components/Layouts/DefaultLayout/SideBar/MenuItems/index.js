import {NavLink} from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MenuItems.module.scss';

const cx = classNames.bind(styles);

const MenuItems = ({title,to,icon, activeIcon, flag}) => {
    
    return (
        <NavLink to={to} className={(data) => cx('wrapper',{active : data.isActive})}>
            <img className={cx('activeIcon')} src={activeIcon} alt='icon'/>
            <img className={cx('icon')} src={icon} alt='icon'/>
            <span className={cx('title')}>{title}</span>
            {flag && <div className={cx('flag')}>New</div>}
        </NavLink>
    );
}
 
export default MenuItems;
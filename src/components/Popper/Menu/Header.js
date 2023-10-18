
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';


const cx = classNames.bind(styles);
const Header = ({title,onBack}) => {
    const {i18n} = useTranslation();
    const dark = useSelector(state => state.theme.dark);
    
    return (
        <header className={cx('header')}>
            <div className={cx('back-icon')}  onClick = {onBack}>
                <FontAwesomeIcon icon = {faAngleLeft}/>
            </div>
            <p className={cx('header-title')}>{title}</p>
        </header>
    );
};

export default Header;

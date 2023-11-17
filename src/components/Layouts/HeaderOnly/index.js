import Header from '../components/Header';

import styles from './HeaderOnly.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const DefaultLayout = ({ children }) => {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>{children}</div>
        </div>
    );
};

export default DefaultLayout;

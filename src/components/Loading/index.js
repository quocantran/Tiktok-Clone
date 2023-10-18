import classNames from "classnames/bind";
import styles from './Loading.module.scss';

const cx = classNames.bind(styles)

const Loading = () => {
    return (
        <i className={cx('loading-icon')}>
            <div className={cx('loader')}></div>
        </i>
    );
};

export default Loading;

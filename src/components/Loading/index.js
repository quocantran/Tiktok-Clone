import classNames from 'classnames/bind';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

const Loading = ({ className }) => {
    return (
        <i
            className={cx('loading-icon', {
                [className]: className,
            })}
        >
            <div className={cx('loader')}></div>
        </i>
    );
};

export default Loading;

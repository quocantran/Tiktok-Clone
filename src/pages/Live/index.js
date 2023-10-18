import classNames from "classnames/bind";
import styles from './Live.module.scss';

const cx = classNames.bind(styles);

const Live = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h2>COMING SOON!</h2>
            </div>
        </div>
    );
}
 
export default Live;
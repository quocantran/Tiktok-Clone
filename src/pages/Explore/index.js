import classNames from "classnames/bind";
import styles from './Explore.module.scss';

const cx = classNames.bind(styles);


const Explore = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h2>COMING SOON!</h2>
            </div>
        </div>
    );
}
 
export default Explore;
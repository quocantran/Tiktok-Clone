import styles from './Popper.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Wrapper = ({children , download}) => {
    return ( 
        <div className={cx('wrapper', {
            download : download
        })}>
            {children}
        </div>
     );
}
 
export default Wrapper;
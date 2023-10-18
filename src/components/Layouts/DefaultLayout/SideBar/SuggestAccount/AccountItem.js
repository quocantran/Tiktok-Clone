import classNames from 'classnames/bind';
import styles from './SuggestAccount.module.scss';
import { useRef } from 'react';
import noImage from '../../../../../assests/png/noImage.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

const AccountItem = ({ data }) => {
    const imgRef = useRef();
    
    const navigate = useNavigate();
    return (
        <div
            className={cx('account-item')}
            onClick={() => {
                navigate(`/@${data.nickname}`);
            }}
        >
            <img
                ref={imgRef}
                src={data.avatar}
                onError={() => {
                    imgRef.current.src = noImage;
                }}
                alt="icon"
            />
            <div className={cx('user-info')}>
                <span className={cx('full-name')}>
                    {data.first_name + ' ' + data.last_name}
                    {data.tick && (
                        <span className={cx('tick')}>
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </span>
                    )}
                </span>
                <p className={cx('nick-name')}>{data.nickname}</p>
            </div>
        </div>
    );
};

export default AccountItem;

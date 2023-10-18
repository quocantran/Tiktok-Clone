import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AccountItems.module.scss';
import classNames from 'classnames/bind';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import noImage from '../../assests/png/noImage.jpg';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const AccountItems = ({ data }) => {
    const imgRef = useRef();

    const navigate = useNavigate();

    return (
        <div
            className={cx('wrapper')}
            onClick={() => {
                
                navigate(`/@${data.nickname}`);
                
            }}
        >
            <img
                ref={imgRef}
                className={cx('user-icon')}
                alt="icon"
                src={data.avatar}
                onError={() => {
                    imgRef.current.src = noImage;
                }}
            />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    {data.full_name || data.first_name || data.last_name}
                    {data.tick && (
                        <span className={cx('check-icon')}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </span>
                    )}
                </h4>
                <p className={cx('nick-name')}>{data.nickname}</p>
            </div>
        </div>
    );
};

export default AccountItems;

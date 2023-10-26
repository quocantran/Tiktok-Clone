import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import noImg from '../../assests/png/noImage.jpg';
import { useRef, useState } from 'react';
import svg from '../../assests/svg';
import request from '../../ultis/request';
import Cookies from 'js-cookie';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);

const CommentItem = ({ data }) => {
    const imgRef = useRef();
    const [dataComment, setData] = useState(data);
    const [like, setLike] = useState(dataComment.is_liked);
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth.login.success);
    const handleClick = () => {
        if(!auth){
            navigate('/login');
            toast.error('Vui lòng đăng nhập!');
            return;
        }
        setLike(!like);

        if (!like) {
            setData((prev) => ({
                ...prev,
                likes_count: prev.likes_count + 1,
            }));
            request.post(`/comments/${dataComment.id}/like`, null, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            });
        } else {
            setData((prev) => ({
                ...prev,
                likes_count: prev.likes_count - 1,
            }));
            request.post(`/comments/${dataComment.id}/unlike`, null, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
            });
        }
    };

    return (
        <div className={cx('comment-list')}>
            <div className={cx('comment-item')}>
                <img
                    onClick={() => {
                        navigate(`/@${dataComment.user.nickname}`);
                    }}
                    className={cx('user-avatar')}
                    ref={imgRef}
                    src={dataComment.user.avatar}
                    onError={() => {
                        imgRef.current.src = noImg;
                    }}
                />
                <div className={cx('comment-user')}>
                    <span
                        onClick={() => {
                            navigate(`/@${dataComment.user.nickname}`);
                        }}
                        className={cx('nick-name')}
                    >
                        {dataComment.user.nickname}
                    </span>
                    <p className={cx('show-comment')}>{dataComment.comment}</p>
                    <p className={cx('create-at')}>{dataComment.created_at.split(' ')[0]}</p>
                </div>
                <span className={cx('like-comment')}>
                    {like ? (
                        <img onClick={handleClick} src={svg.heartActive} alt="icon" />
                    ) : (
                        <img onClick={handleClick} src={svg.heartComment} alt="icon" />
                    )}
                    <p>{dataComment.likes_count}</p>
                </span>
            </div>
        </div>
    );
};

export default CommentItem;

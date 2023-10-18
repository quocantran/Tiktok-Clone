import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useEffect, useState } from 'react';

import request from '../../ultis/request';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import ProfileContent from './ProfileContent';
const cx = classNames.bind(styles);

const Profile = () => {
    const [data, setData] = useState({});
    const { nickname } = useParams();
    const [isFollowed,setIsFollowed] = useState();
    const [loading, setLoading] = useState();
    const [mount,setMount] = useState(false);

    useEffect(() => {
        async function getData() {
            setLoading(true);
            try {
                const res = await request.get(`/users/@${nickname}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token')}`,
                    },
                });
                setData(res.data.data);
                
                setIsFollowed(data.is_followed);
                setLoading(false);
                
            } catch (err) {}
        }
        getData();
    }, [nickname,data.is_followed,mount]);

    return (
        <div className={cx('wrapper')}>
            {loading ? (
                <></>
            ) : (
                <ProfileContent mount = {mount} setMount = {setMount} followed = {isFollowed} dataVideo={data.videos} data={data}/>
            )}
        </div>
    );
};

export default Profile;

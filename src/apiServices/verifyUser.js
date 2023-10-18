import request from '../ultis/request';

import Cookies from 'js-cookie';

const verifyUser = async () => {
    try {
        const res = await request.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${Cookies.get('access_token')}`,
            },
        });
        return res.data;
    } catch (err) {}
};

export default verifyUser;

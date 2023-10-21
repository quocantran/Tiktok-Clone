import axios from 'axios';
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSucces } from './authSlice';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import request from '../ultis/request';

export const loginUser = async (user, dispatch, navigate,isNavigateHome) => {
    dispatch(loginStart());

    try {
        const res = await request.post('/auth/login', user);

        dispatch(loginSuccess(res.data.data));

        toast.success('Đăng nhập thành công');

        navigate('/');
        Cookies.set('access_token', res.data.meta.token, {
            expires: 1,
            path: '/',
            secure: true,
            sameSite: 'strict',
        });
    } catch (err) {
        if (err.response) {
            
            toast.error('Email hoặc mật khẩu không chính xác!');
        }
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());

    try {
        const res = await request.post('/auth/register', user);
        dispatch(registerSucces());
        toast.success('Đăng ký thành công!');
        navigate('/login');
    } catch (err) {
        if (err.response) {
            console.log(err);
            toast.error('Email đã tồn tại!');
            dispatch(registerFailed());
        }
    }
};

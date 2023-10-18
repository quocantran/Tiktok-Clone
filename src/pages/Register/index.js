import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { registerUser } from '../../redux/apiRequest';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const cx = classNames.bind(styles);

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: yup.object({
            email: yup
                .string()
                .required('Trường này là bắt buộc!')
                .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Vui lòng điền đúng định dạng email!'),
            password: yup
                .string()
                .required('Trường này là bắt buộc!')
                .matches(/[0-9a-zA-Z]{6,}/, 'Mật khẩu cần tối thiểu 6 ký tự!'),
            confirmPassword: yup
                .string()
                .required('Trường này là bắt buộc!')
                .oneOf([yup.ref('password'), null], 'Mật khẩu nhập lại chưa chính xác!'),
        }),

        onSubmit: () => {
            const newUser = {
                type : 'email',
                email: formik.values.email,
                password: formik.values.password,
            };
            registerUser(newUser, dispatch, navigate);
        },
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('wrap-login')}>
                    <form onSubmit={formik.handleSubmit} className={cx('login-form')}>
                        <header className={cx('header')}>REGISTER</header>

                        <div className={cx('wrap-inp')}>
                            <label className={cx('user-label')}>Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={cx('input')}
                                placeholder="Type your email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                            <span className={cx('icon')}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>
                        {formik.errors.email && <p className={cx('error-message')}>{formik.errors.email}</p>}
                        <div className={cx('wrap-inp')}>
                            <label className={cx('user-label')}>Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={cx('input')}
                                placeholder="Type your password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                            />
                            <span className={cx('icon')}>
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                        </div>
                        {formik.errors.password && <p className={cx('error-message')}>{formik.errors.password}</p>}

                        <div className={cx('wrap-inp')}>
                            <label className={cx('user-label')}>Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className={cx('input')}
                                placeholder="Confirm password"
                                onChange={formik.handleChange}
                                value={formik.values.confirmPassword}
                            />
                            <span className={cx('icon')}>
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                        </div>
                        {formik.errors.confirmPassword && (
                            <p className={cx('error-message')}>{formik.errors.confirmPassword}</p>
                        )}
                        <div className={cx('register')}>
                            <Link to="/login">Already have an account? Log in</Link>
                        </div>
                        <div className={cx('submit-btn')}>
                            <button type="submit">SIGN UP</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

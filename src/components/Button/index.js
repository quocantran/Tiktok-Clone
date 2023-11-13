import styles from './Button.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

const Button = ({ to, href, target, children, primary, className, outline, large, onClick, download, active }) => {
    let Comp = 'button';
    let props = {
        onClick,
    };
    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    const classes = cx('wrapper', {
        [className]: className,
        primary,
        outline,
        large,
        download,
    });
    return (
        <Comp
            style={{ backgroundColor: active ? 'rgba(254, 44, 85, 0.12)' : null }}
            className={classes}
            target={target}
            {...props}
        >
            <span>{children}</span>
        </Comp>
    );
};

export default Button;

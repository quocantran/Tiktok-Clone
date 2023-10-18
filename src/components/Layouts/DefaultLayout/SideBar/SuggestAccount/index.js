import classNames from "classnames/bind";
import styles from './SuggestAccount.module.scss';
import AccountItem from "./AccountItem";
import { useState } from "react";
import { useTranslation } from "react-i18next";


const cx = classNames.bind(styles);


const SuggestAccount = ({label,data,onSeeMore,onSeeLess}) => {
    const [isSeeMore,setIsSeeMore] = useState(true);
    const {t} = useTranslation();
    return (
        <div className={cx('wrapper')}>
            <p className={cx('header')}>{label}</p>
            {data.map((item,idx) => {
                return <AccountItem key = {idx}  data = {item}/>
            })}
            {isSeeMore && <p className={cx('see-more')} onClick = {() => {
                onSeeMore();
                setIsSeeMore(false);
            }}>{t('See more')}</p>}
            {!isSeeMore && <p className={cx('see-more')} onClick = {() => {
                onSeeLess();
                setIsSeeMore(true);
            }}>{t('See less')}</p> }

            
        </div>
    );
}
 
export default SuggestAccount;
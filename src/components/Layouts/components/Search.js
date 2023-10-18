import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import * as searchService from '../../../apiServices/search';
import { Wrapper as PopperWrapper } from '../../Popper';
import AccountItems from '../../AccountItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../../hooks';
const cx = classNames.bind(styles);

const Search = () => {
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef();
    const [searchResult, setSearchResult] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const debounce = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!searchValue.trim()) {
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            const result = await searchService.Search(debounce, 'less');
            setSearchResult(result.data);
            
            setLoading(false);
        };
        fetchApi();
    }, [debounce]);

    const handleClickOutside = () => {
        setShowSearchResult(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if(searchValue[0] !== ' '){
            setSearchValue(e.target.value);
        }

        

    }
   

    return (
        <div className={cx('wrap-input')}>
            <div className={cx('input-container')}>
                <Tippy
                    interactive
                    visible={showSearchResult && searchResult?.length > 0}
                    render={(attrs) => (
                        <div tabIndex={-1} className={cx('result')}>
                            <PopperWrapper>
                                <h4 className={cx('title')}>Accounts</h4>
                                {searchResult?.map((item) => {
                                    return <AccountItems key={item.id} data={item} />;
                                })}
                            </PopperWrapper>
                        </div>
                    )}
                    onClickOutside={handleClickOutside}
                >
                    <form className={cx(`search-form`)}>
                        <input
                            ref={inputRef}
                            value={searchValue}
                            className={cx('search-input')}
                            placeholder="Search"
                            spellCheck={false}
                            type="text"
                            onChange={handleChange}
                            onFocus={() => setShowSearchResult(true)}
                        />
                        {!!searchValue && !loading && (
                            <div
                                className={cx('clear')}
                                onClick={(e) => {
                                    setSearchValue('');
                                    setSearchResult([]);
                                    inputRef.current.focus();
                                }}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </div>
                        )}
                        {loading && (
                            <div className={cx('loading')}>
                                <FontAwesomeIcon icon={faSpinner} />
                            </div>
                        )}

                        <span className={cx('after')}></span>
                        <button className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </form>
                </Tippy>
            </div>
        </div>
    );
};

export default Search;

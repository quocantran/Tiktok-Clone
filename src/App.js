import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { publicRoutes } from './routes/index';
import { DefaultLayout } from './components/Layouts';
import { Fragment, useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import verifyUser from './apiServices/verifyUser';
import { useDispatch } from 'react-redux';
import { isAuth, loginSuccess } from './redux/authSlice';

function App() {
    const language = useSelector((state) => state.language.languageDefault);
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await verifyUser();
                if (res?.data) {
                    dispatch(isAuth(true));
                    dispatch(loginSuccess(res.data));
                } else {
                    dispatch(isAuth(false));
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    return (
        <Router>
            {loading ? (
                <></>
            ) : (
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, idx) => {
                            let Layout = DefaultLayout;
                            if (route.layout === null) Layout = Fragment;
                            else if (route.layout) Layout = route.layout;
                            return (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <route.component />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            )}
        </Router>
    );
}

export default App;

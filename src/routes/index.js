import Home from '../pages/Home';
import Following from '../pages/Following';
import Upload from '../pages/Upload';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Live from '../pages/Live';
import Explore from '../pages/Explore';
import Comment from '../pages/Comment';
import { HeaderOnly } from '../components/Layouts';

const publicRoutes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/following',
        component: Following,
    },

    {
        path: '/live',
        component: Live,
    },
    {
        path: '/explore',
        component: Explore,
    },

    {
        path: '/upload',
        component: Upload,
        layout: HeaderOnly,
    },

    {
        path: '/login',
        component: Login,
        layout: null,
    },

    {
        path: '/register',
        component: Register,
        layout: null,
    },
    {
        path: '/@:nickname',
        component: Profile,
    },

    {
        path: '/all/video/:id',
        component: Comment,
    },
];

export { publicRoutes };

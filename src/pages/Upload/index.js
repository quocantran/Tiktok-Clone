import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';

const Upload = () => {
    const navigate = useNavigate();
    const isAuth = useSelector((state) => state.auth.login.success);
    if (!isAuth) {
        navigate('/login')
        toast.error('Vui lòng đăng nhập!');
        
    }

    return <div>upload</div>;
};

export default Upload;

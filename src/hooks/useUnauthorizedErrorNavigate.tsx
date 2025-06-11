import { useNavigate } from 'react-router';

export default function useUnauthorizedErrorNavigate() {
    const navigate = useNavigate();

    return (error: any) => {
        console.log('Unauthorized error navigate:', error);

        if (error?.status === 401) {
            navigate('/', { replace: true });
            navigate(0);
        }
    };
}
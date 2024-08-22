import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));

    if (!token) {
      navigate('/auth'); // Redirect to the auth page if the token cookie is not present
    }
  }, [navigate]);
};

export default useAuthRedirect;

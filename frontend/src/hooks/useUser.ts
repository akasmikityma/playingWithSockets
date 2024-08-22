import { useRecoilState } from 'recoil';
import { userAtom } from '../store/allAtoms';
import { useEffect } from 'react';

export const useUser = () => {
  const [userState, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/getme', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log(`response data :`,data)
          setUserState(data);
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    // Only fetch the user if it is not already set
    if (!userState) {
      fetchUser();
    }
  }, [userState, setUserState]);

  return userState;
};

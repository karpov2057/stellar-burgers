import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { fetchLogoutUser } from '../../slices/stellarBurgerSlice';
import { useDispatch } from '../../services/store';
import { deleteCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(fetchLogoutUser())
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        }
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

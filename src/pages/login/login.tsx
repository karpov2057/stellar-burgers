import { FC, SyntheticEvent, ChangeEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchLoginUser } from '../../slices/stellarBurgerSlice';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  const [email, setEmailState] = useState<string>('');
  const [password, setPasswordState] = useState<string>('');

  // const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setEmailState(e.target.value);
  // };

  // const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setPasswordState(e.target.value);
  // };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const payload = await dispatch(
      fetchLoginUser({ email, password })
    ).unwrap();
    setCookie('accessToken', payload.accessToken);
    localStorage.setItem('refreshToken', payload.refreshToken);
    navigate(from.pathname, { replace: true });
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmailState}
      password={password}
      setPassword={setPasswordState}
      handleSubmit={handleSubmit}
    />
  );
};

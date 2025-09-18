import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthorized } from '../../slices/stellarBurgerSlice';
interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

export const ProtectedRoute = ({ isAuthenticated }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthorized = useSelector(selectIsAuthorized);

  const from = location.state?.from || '/';

  if (!isAuthenticated && !isAuthorized) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (isAuthenticated && isAuthorized) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

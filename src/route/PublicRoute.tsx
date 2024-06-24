import { Navigate, Outlet } from 'react-router-dom';

import appConfig from '@/configs/app.config';
import { selectIsAuthenticated } from '@/store/auth/authSelectors';
import { useAppSelector } from '@/store/store';

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);

  return isAuth ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute;
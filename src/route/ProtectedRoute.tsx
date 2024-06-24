import { Navigate, Outlet, useLocation } from 'react-router-dom';

import appConfig from '@/configs/app.config';
import { selectIsAuthenticated } from '@/store/auth/authSelectors';
import { useAppSelector } from '@/store/store';

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);

  const location = useLocation()

  if (!isAuth) {
    return (
      <Navigate
        replace
        to={`${unAuthenticatedEntryPath}?redirectUrl=${location.pathname}`}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
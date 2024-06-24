import { Suspense } from 'react'
import appConfig from '@/configs/app.config'
import { Routes, Route, Navigate } from 'react-router-dom'
import {protectedRoutes, publicRoutes} from "@/configs/routes.config";
import ProtectedRoute from "@/route/ProtectedRoute";
import AppRoute from "@/route/AppRoute";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  // layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
  const userAuthority = []

  return (
    <Routes>
      {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
              />
            }
          />
      ))}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Navigate replace to={authenticatedEntryPath} />}
        />
        {protectedRoutes.map((route, index) => (
          <Route
            key={route.key + index}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
              />
            }
          />
        ))}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  )
}

const Views = (props: ViewsProps) => {
  return (
    <Suspense fallback={
      <LoadingScreen/>
    }>
      <AllRoutes {...props} />
    </Suspense>
  )
}

export default Views

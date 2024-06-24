import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { ComponentType } from 'react';

import {
    useAppSelector,
    useAppDispatch,
} from '@/store/store';

import { setCurrentRouteKey } from '@/store/base/commonSlice';

export type AppRouteProps<T> = {
  component: ComponentType<T>
  routeKey: string
}

const AppRoute = <T extends Record<string, unknown>>({
  component: Component,
  routeKey,
  ...props
}: AppRouteProps<T>) => {
  const location = useLocation()

  const dispatch = useAppDispatch()


  const handleLayoutChange = useCallback(() => {
    dispatch(setCurrentRouteKey(routeKey))


  }, [dispatch, routeKey])

  useEffect(() => {
    handleLayoutChange()
  }, [location, handleLayoutChange])

  return <Component {...(props as T)} />
}

export default AppRoute
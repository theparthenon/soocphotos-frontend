import React, {lazy, Suspense, useMemo} from "react";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";
import { useAppSelector } from "@/store/store";

export function Layout() {
  const isAuth = useAppSelector(selectIsAuthenticated);

  const AppLayout = useMemo(() => {
    if (isAuth) {
     return  lazy(() => import('./Theme/Core'))
    }
    return lazy(() => import('./AuthLayout'))
  }, [isAuth])

  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <LoadingScreen/>
        </div>
      }
    >
      <AppLayout/>
    </Suspense>
  );
}

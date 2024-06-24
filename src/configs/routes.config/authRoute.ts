import { lazy } from 'react';
import type { Routes } from '@/@types/routes';

const authRoute: Routes = [
  {
    key: 'login',
    path: `/login`,
    component: lazy(() => import('@/pages/login/Login')),
    authority: [],
  },
  // {
  //   key: 'signUp',
  //   path: `/sign-up`,
  //   component: lazy(() => import('@/views/auth/SignUp')),
  //   authority: []
  // },
];

export default authRoute;

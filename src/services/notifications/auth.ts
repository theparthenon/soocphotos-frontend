import { showNotification } from '@mantine/notifications';

import { toUpperCase } from '@/utils/stringUtils';

const errorMap = new Map([
  ['token_not_valid', 'Login expired. Please log in again.'],
  ['token', 'Token Issue'],
]);

function authError(isLogin: boolean, field: string, display: string) {
  const message =
    isLogin && errorMap.has(`login.error${field}`) ? errorMap.get(`login.error${field}`) : display;

  showNotification({
    message,
    title: toUpperCase(field),
    color: 'red',
  });
}

function invalidToken() {
  showNotification({
    message: 'Login expired. Please log in again.',
    title: 'Token Issue',
    color: 'red',
  });
}

export const auth = {
  authError,
  invalidToken,
};

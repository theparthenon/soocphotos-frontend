import { showNotification } from '@mantine/notifications';

function updateUser(username: string) {
  showNotification({
    message: username + "'s info updated.",
    title: 'Update User',
    color: 'teal',
  });
}

export const user = {
  updateUser,
};

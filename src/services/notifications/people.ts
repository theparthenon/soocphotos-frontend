import { showNotification } from '@mantine/notifications';

function renamePerson(oldName: string, newName: string) {
  showNotification({
    message: 'Person ' + oldName + ' was successfully renamed to ' + newName + '.',
    title: 'Rename Person',
    color: 'teal',
  });
}

function deletePerson() {
  showNotification({
    message: 'Person Deleted.',
    title: 'Delete Person',
    color: 'teal',
  });
}

export const people = {
  deletePerson,
  renamePerson,
};

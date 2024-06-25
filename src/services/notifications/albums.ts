import { showNotification } from '@mantine/notifications';

function setCoverPhoto() {
  showNotification({
    message: 'Cover photo set.',
    title: 'Set Cover Photo',
    color: 'teal',
  });
}

function addPhotosToAlbum(title: string, numberOfPhotos: number) {
  showNotification({
    message: numberOfPhotos + ' photo(s) were added to the existing ' + title + ' album.',
    title: 'Add to Album',
    color: 'teal',
  });
}

function removePhotosFromAlbum(title: string, numberOfPhotos: number) {
  showNotification({
    message: numberOfPhotos + ' photo(s) were successfully removed from album ' + title + '.',
    title: 'Remove from Album',
    color: 'teal',
  });
}

function createAlbum(title: string, numberOfPhotos: number) {
  showNotification({
    message: numberOfPhotos + ' photo(s) were added to the new ' + title + ' album.',
    title: 'Create Album',
    color: 'teal',
  });
}

function renameAlbum(oldTitle: string, newTitle: string) {
  showNotification({
    message: oldTitle + ' was successfully renamed to ' + newTitle + '.',
    title: 'Rename Album',
    color: 'teal',
  });
}

function deleteAlbum(albumTitle: string) {
  showNotification({
    message: albumTitle + ' was successfully deleted.',
    title: 'Delete Album',
    color: 'teal',
  });
}

function deleteAutogeneratedAlbums() {
  showNotification({
    message: 'All auto created albums deleted.',
    title: 'Delete All Auto Created Albums',
    color: 'teal',
  });
}

function generateEventAlbums() {
  showNotification({
    message: 'Generating event albums...',
    title: 'Generate Event Albums',
    color: 'teal',
  });
}

function regenerateEventAlbums() {
  showNotification({
    message: 'Regenerating event albums...',
    title: 'Regenerate Event Albums',
    color: 'teal',
  });
}

export const albums = {
  addPhotosToAlbum,
  createAlbum,
  deleteAlbum,
  deleteAutogeneratedAlbums,
  generateEventAlbums,
  regenerateEventAlbums,
  removePhotosFromAlbum,
  renameAlbum,
  setCoverPhoto,
};
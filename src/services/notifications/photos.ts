import { showNotification } from '@mantine/notifications';

function togglePhotoDelete(isDeleted: boolean, numberOfPhotos: number) {
  const notificationMessage = isDeleted
    ? numberOfPhotos + ' photo(s) were moved to trash.'
    : numberOfPhotos + '  photo(s) were recovered.';
  showNotification({
    message: notificationMessage,
    title: 'Delete Images',
    color: 'teal',
  });
}

function removePhotos(numberOfPhotos: number) {
  showNotification({
    message: numberOfPhotos + ' photo(s) were permanently deleted.',
    title: 'Delete Images',
    color: 'teal',
  });
}

function downloadStarting() {
  showNotification({
    message: 'Download Starting...',
    title: 'Download Starting',
    color: 'teal',
  });
}

function downloadCompleted() {
  showNotification({
    message: 'Files downloaded successfully.',
    title: 'Download Complete',
    color: 'teal',
  });
}

function downloadFailed() {
  showNotification({
    message: 'Error while downloading files.',
    title: 'Download Failed',
    color: 'red',
  });
}

function togglePhotosFavorite(numberOfPhotos: number, isFavorite: boolean) {
  const notificationMessage = isFavorite
    ? numberOfPhotos + ' photo(s) were added to your favorites.'
    : numberOfPhotos + ' photo(s) unfavorited.';
  showNotification({
    message: notificationMessage,
    title: 'Set Favorites',
    color: 'teal',
  });
}

function togglePhotosHidden(numberOfPhotos: number, isHidden: boolean) {
  const notificationMessage = isHidden
    ? numberOfPhotos + ' photo(s) were hidden.'
    : numberOfPhotos + ' photo(s) were unhidden.';
  showNotification({
    message: notificationMessage,
    title: 'Set Hidden',
    color: 'teal',
  });
}

function startPhotoScan() {
  showNotification({
    message: 'Scanning photos...',
    title: 'Scan Photos',
    color: 'teal',
  });
}

function startUploadedPhotoScan() {
  showNotification({
    message: 'Scanning uploaded photos...',
    title: 'Scan Uploaded Photos',
    color: 'teal',
  });
}

function startFullPhotoScan() {
  showNotification({
    message: 'Scanning photos (full)...',
    title: 'Scan Photos (Full)',
    color: 'teal',
  });
}

function savePhotoCaptions() {
  showNotification({
    message: 'Image caption updated.',
    title: 'Update Caption',
    color: 'teal',
  });
}

function updatePhoto() {
  showNotification({
    message: 'Photo edited.',
    title: 'Edit Photo',
    color: 'teal',
  });
}

function deleteMissingPhotos() {
  showNotification({
    message: 'Deleting missing photos...',
    title: 'Delete Missing Photos',
    color: 'teal',
  });
}

export const photos = {
  deleteMissingPhotos,
  downloadCompleted,
  downloadFailed,
  downloadStarting,
  removePhotos,
  savePhotoCaptions,
  startFullPhotoScan,
  startPhotoScan,
  startUploadedPhotoScan,
  togglePhotoDelete,
  togglePhotosFavorite,
  togglePhotosHidden,
  updatePhoto,
};

import { showNotification } from '@mantine/notifications';

function trainFaces() {
  showNotification({
    message: 'Analysis started...',
    title: 'Facial Recognition',
    color: 'teal',
  });
}

function rescanFaces() {
  showNotification({
    message: 'Scanning started...',
    title: 'Face Rescanning',
    color: 'teal',
  });
}

function deleteFaces(numberOfFaces: number) {
  showNotification({
    message: numberOfFaces + ' face(s) were successfully deleted.',
    title: 'Delete Faces',
    color: 'teal',
  });
}

function addFacesToPerson(personName: string, numberOfFaces: number) {
  showNotification({
    message: numberOfFaces + ' face(s) were labeled as the person ' + personName + '.',
    title: 'Add Faces to Person',
    color: 'teal',
  });
}

function removeFacesFromPerson(numberOfFaces: number) {
  showNotification({
    message: numberOfFaces + " face(s) were moved to 'Unknown - Other.",
    title: 'Remove Faces from Person',
    color: 'teal',
  });
}

export const faces = {
  addFacesToPerson,
  deleteFaces,
  removeFacesFromPerson,
  rescanFaces,
  trainFaces,
};

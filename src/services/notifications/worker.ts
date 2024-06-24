import { showNotification } from '@mantine/notifications';

function jobFinished(title: string, job: string) {
  showNotification({
    message: "Job '" + job + "' Finished",
    title,
    color: 'teal',
  });
}

export const worker = {
  jobFinished,
};

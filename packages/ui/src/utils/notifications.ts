import { notifications } from '@mantine/notifications';

export const successNotification = (message: string) => {
	notifications.show({
		title: 'Success',
		message,
		color: 'green',
		autoClose: 3000,
	});
};

export const errorNotification = (message: string) => {
	notifications.show({
		title: 'Error',
		message,
		color: 'red',
		autoClose: 5000,
	});
};

export const statusOptions = [
	{ value: 'todo', label: 'To Do' },
	{ value: 'in_progress', label: 'In Progress' },
	{ value: 'done', label: 'Done' },
];

export const priorityOptions = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
];

export const priorityColors: Record<string, string> = {
	low: 'blue',
	medium: 'yellow',
	high: 'red',
};

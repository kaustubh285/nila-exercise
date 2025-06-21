interface Project {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	tasks?: Task[];
	taskCount?: number;
}

interface Task {
	id: string;
	title: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	status: 'todo' | 'in_progress' | 'done';
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
	projectId: string;
}

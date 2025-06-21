import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@nila/client/src/client.gen.ts';

export const useProjects = () => {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const response = await client.get({
				url: '/v1/projects',
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const { data } = response.data as { data: Project[] };
			if (!data || !Array.isArray(data)) {
				throw new Error('Invalid response format for projects');
			}

			return data || [];
		},
	});
};

export const useProject = (projectId: string | undefined) => {
	return useQuery({
		queryKey: ['project', projectId],
		queryFn: async () => {
			if (!projectId) {
				throw new Error('Project ID is required');
			}
			const response = await client.get({
				url: `/v1/projects/${projectId}`,
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			return response.data as Project;
		},
		enabled: !!projectId,
	});
};

export const useCreateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { name: string; description: string }) => {
			const response = await client.post({
				url: '/v1/projects',
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
				body: data,
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});
};

export const useUpdateProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			projectId,
			data,
		}: {
			projectId: string;
			data: { name?: string; description?: string };
		}) => {
			const response = await client.patch({
				url: `/v1/projects/${projectId}`,
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
				body: data,
			});
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
		},
	});
};

export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (projectId: string) => {
			await client.delete({
				url: `/v1/projects/${projectId}`,
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});
};

export const useCreateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			title: string;
			description: string;
			status: 'todo' | 'in_progress' | 'done';
			priority: 'low' | 'medium' | 'high';
			projectId: string;
		}) => {
			const response = await client.post({
				url: '/v1/tasks',
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
				body: data,
			});
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
		},
	});
};

export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			taskId,
			projectId,
			data,
		}: {
			taskId: string;
			projectId: string;
			data: {
				title?: string;
				description?: string;
				status?: 'todo' | 'in_progress' | 'done';
				priority?: 'low' | 'medium' | 'high';
			};
		}) => {
			const response = await client.put({
				url: `/v1/tasks/${taskId}`,
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
				body: data,
			});
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
		},
	});
};

export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ taskId }: { taskId: string; projectId: string }) => {
			await client.delete({
				url: `/v1/tasks/${taskId}`,
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
		},
	});
};

export const useLogin = () => {
	return useMutation({
		mutationFn: async (credentials: { email: string; password: string }) => {
			const response = await client.post({
				url: '/v1/users/login',
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
				body: credentials,
			});
			return response.data;
		},
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: async (userData: { email: string; password: string }) => {
			const response = await client.post({
				url: '/v1/users/register',
				baseUrl: 'http://localhost:3000',
				headers: {
					'Content-Type': 'application/json',
				},
				body: userData,
			});
			return response.data;
		},
	});
};

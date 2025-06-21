import { useState } from 'react';
import { ActionIcon, Badge, Button, Card, Group, Loader, Modal, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { successNotification, errorNotification } from '../utils/notifications';
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/api-hooks';



export const ProjectsPage = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();


    const { data: projects, isLoading } = useProjects();
    const createProject = useCreateProject();
    const deleteProject = useDeleteProject();

    const form = useForm({
        initialValues: {
            name: '',
            description: '',
        },
        validate: {
            name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
            description: (value) => (value.trim().length > 0 ? null : 'Description is required'),
        },
    });

    const handleSubmit = async (values: { name: string; description: string }) => {
        try {
            await createProject.mutateAsync(values);
            form.reset();
            close();
            successNotification('Project created successfully');
        } catch (error) {
            console.error('Error creating project:', error);
            errorNotification('Failed to create project');
        }
    };

    const handleDeleteProject = async (project: Project) => {
        if (confirm(`Are you sure you want to delete this project?, it still has ${project.taskCount} tasks associated with it`)) {
            try {
                await deleteProject.mutateAsync(project.id);
                successNotification('Project deleted successfully');
            } catch (error) {
                console.error('Error deleting project:', error);
                errorNotification('Failed to delete project');
            }
        }
    };

    const filteredProjects = projects?.filter((project: Project) => {
        if (!searchQuery.trim()) {
            return true;
        }
        
        const query = searchQuery.toLowerCase();
        return (
            project.name.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query)
        );
    });

    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Title order={2}>Projects</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
                    New Project
                </Button>
            </Group>

            <TextInput
                placeholder="Search projects by name or description..."
                mb="md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />

            {isLoading ? (
                <Loader size="lg" type="dots" />
            ) : filteredProjects?.length === 0 ? (
                <Card withBorder p="xl" radius="md">
                    <Text ta="center" fw={500} size="lg">
                        {searchQuery ? 'No matching projects found' : 'No projects yet'}
                    </Text>
                    <Text ta="center" c="dimmed" mt="xs">
                        {searchQuery ? 'Try a different search query' : 'Create your first project to get started'}
                    </Text>
                    {!searchQuery && (
                        <Button mt="md" fullWidth onClick={open}>
                            Create Project
                        </Button>
                    )}
                </Card>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {filteredProjects?.map((project: Project) => (
                        <Card 
                            key={project.id} 
                            withBorder 
                            padding="lg" 
                            radius="md"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <Group justify="space-between" mb="xs">
                                <Text fw={500}>{project.name}</Text>
                                <ActionIcon 
                                    color="red" 
                                    variant="subtle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProject(project);
                                    }}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                            <Text size="sm" c="dimmed" mb="md">
                                {project.description}
                            </Text>
                            <Badge>{project.taskCount} Tasks</Badge>
                        </Card>
                    ))}
                </div>
            )}

            <Modal opened={opened} onClose={close} title="Create New Project" centered>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="Project name"
                            required
                            {...form.getInputProps('name')}
                        />
                        <Textarea
                            label="Description"
                            placeholder="Project description"
                            required
                            minRows={3}
                            {...form.getInputProps('description')}
                        />
                        <Button type="submit" fullWidth mt="md" loading={createProject.isPending}>
                            Create Project
                        </Button>
                    </Stack>
                </form>
            </Modal>
        </div>
    );
};
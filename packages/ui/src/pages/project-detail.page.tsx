import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ActionIcon, Badge, Button, Card, Group, Loader, Modal, 
    Select, Stack, Tabs, Text, TextInput, Textarea, Title 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { successNotification, errorNotification } from '../utils/notifications';
import { useProject, useCreateTask, useUpdateTask, useDeleteTask, useDeleteProject } from '../hooks/api-hooks';
import { statusOptions, priorityOptions, priorityColors } from '../utils/constants';



export const ProjectDetailPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const { data: project, isLoading } = useProject(projectId);
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const deleteProject = useDeleteProject()
    const navigate = useNavigate();


    const form = useForm({
        initialValues: {
            id: '', 
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
        },
        validate: {
            title: (value) => (value.trim().length > 0 ? null : 'Title is required'),
            description: (value) => (value.trim().length > 0 ? null : 'Description is required'),
        },
    });


    const handleSubmit = async (values: any) => {
        try {
            const { id, ...data } = values;
            if (isEditing) {
                console.log('Updating task:', data);
                await updateTask.mutateAsync({
                    taskId: id as string, 
                    projectId: projectId as string,
                    data: data,
                });
                setIsEditing(false);

            form.reset();
            close();
            successNotification('Task updated successfully');
            } else {
                
                await createTask.mutateAsync({
                    ...data,
                    projectId: projectId as string,
                });

                form.reset();
                close();
                successNotification('Task created successfully');
            }

        } catch (error) {
            console.error('Error creating task:', error);
            errorNotification('Failed to create task');
        }
    };

    const handleDeleteTask = async (task: Task) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask.mutateAsync({
                    taskId: task.id, 
                    projectId: projectId as string,
                });
                successNotification('Task deleted successfully');
            } catch (error) {
                console.error('Error deleting task:', error);
                errorNotification('Failed to delete task');
            }
        }
    };


    const handleUpdateTaskStatus = async (taskId: string, status: string) => {
        try {
            await updateTask.mutateAsync({
                taskId,
                projectId: projectId as string,
                data: {
                    status: status as 'todo' | 'in_progress' | 'done',
                },
            });
            successNotification('Task updated successfully');
        } catch (error) {
            console.error('Error updating task:', error);
            errorNotification('Failed to update task');
        }
    };


    const getFilteredTasks = () => {
        if (!project || !project?.tasks) {return [];}
        
        return project.tasks.filter((task: Task) => {
            
            const statusMatch = !selectedStatus || task.status === selectedStatus;
            
            const priorityMatch = !selectedPriority || task.priority === selectedPriority;
            
            const query = searchQuery.toLowerCase();
            const searchMatch = !searchQuery || 
                task.title.toLowerCase().includes(query) || 
                task.description.toLowerCase().includes(query);
            
            return statusMatch && priorityMatch && searchMatch;
        });
    };

    const handleDeleteProject = async () => {
        if (confirm(`Are you sure you want to delete this project?, it still has ${project?.tasks?.length} tasks associated with it`)) {
            try {
                await deleteProject.mutateAsync(project?.id as string);
                successNotification('Project deleted successfully');
                navigate('/projects');
            } catch (error) {
                console.error('Error deleting project:', error);
                errorNotification('Failed to delete project');
            }
        }
    };

    const groupedTasks = {
        todo: getFilteredTasks().filter((task: Task) => task.status === 'todo'),
        in_progress: getFilteredTasks().filter((task: Task) => task.status === 'in_progress'),
        done: getFilteredTasks().filter((task: Task) => task.status === 'done'),
    };

    if (isLoading) {
        return <Loader size="lg" type="dots" />;
    }

    if (!project) {
        return <Text>Project not found</Text>;
    }

    return (
        <div>
            <Group justify="space-between" mb="md">
                <div>
                    <Title order={2}>{project.name}</Title>
                    <Text c="dimmed" mb="lg">{project.description}</Text>
                </div>
                <Group>
                    <Button leftSection={<IconPlus size={16} />} onClick={open}>
                        Add Task
                    </Button>
                    <Button color='red' leftSection={<IconTrash size={16} />} onClick={handleDeleteProject}>
                        Delete Project
                    </Button>
                </Group>
            </Group>

            {/* Search and filter controls in a group */}
            <Group mb="lg" align="flex-end">
                <TextInput
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{ flexGrow: 1 }}
                />
                <Select
                    placeholder="Filter by Status"
                    data={statusOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    clearable
                    style={{ minWidth: '150px' }}
                />
                <Select
                    placeholder="Filter by Priority"
                    data={priorityOptions}
                    value={selectedPriority}
                    onChange={setSelectedPriority}
                    clearable
                    style={{ minWidth: '150px' }}
                />
            </Group>

            {/* Tasks organized by status */}
            <Tabs defaultValue="kanban">
                <Tabs.List mb="md">
                    <Tabs.Tab value="kanban">Kanban Board</Tabs.Tab>
                    <Tabs.Tab value="list">List View</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="kanban">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {/* Todo column */}
                        <Card withBorder padding="md">
                            <Text fw={700} mb="md">To Do ({groupedTasks.todo.length})</Text>
                            <Stack>
                                {groupedTasks.todo.map((task: Task) => (
                                    <Card key={task.id} withBorder shadow="sm" padding="sm" onClick={()=>{
                                        form.setValues({
                                            id: task.id,
                                            title: task.title,
                                            description: task.description,
                                            status: task.status,
                                            priority: task.priority,
                                        });
                                        setIsEditing(true);
                                        open();    
                                    }} 
                                        style={{ cursor: 'pointer' }}
                                        >
                                        <Group justify="space-between" mb="xs" >
                                            <Text fw={500}>{task.title}</Text>
                                            <Group gap={5}>
                                                <Badge color={priorityColors[task.priority]}>
                                                    {task.priority}
                                                </Badge>
                                                <ActionIcon 
                                                    size="xs" 
                                                    color="red"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTask(task);
                                                    }}
                                                >
                                                    <IconTrash size={14} />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                        <Text size="sm" color="dimmed" lineClamp={2}>{task.description}</Text>
                                        <Group justify="flex-end" mt="xs">
                                            <Button 
                                                size="xs" 
                                                variant="light"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateTaskStatus(task.id, 'in_progress');
                                                }}
                                            >
                                                Start Progress →
                                            </Button>
                                        </Group>
                                    </Card>
                                ))}
                            </Stack>
                        </Card>

                        {/* In Progress column */}
                        <Card withBorder padding="md">
                            <Text fw={700} mb="md">In Progress ({groupedTasks.in_progress.length})</Text>
                            <Stack>
                                {groupedTasks.in_progress.map((task: Task) => (
                                    <Card key={task.id} withBorder shadow="sm" padding="sm" onClick={()=>{
                                        form.setValues({
                                            id: task.id,
                                            title: task.title,
                                            description: task.description,
                                            status: task.status,
                                            priority: task.priority,
                                        });
                                        setIsEditing(true);
                                        open();
                                    }}
                                    style={{ cursor: 'pointer' }}>
                                        <Group flex="justify" mb="xs">
                                            <Text fw={500}>{task.title}</Text>
                                            <Group gap={5} >
                                                <Badge color={priorityColors[task.priority]}>
                                                    {task.priority}
                                                </Badge>
                                                <ActionIcon 
                                                    
                                                    size="xs" 
                                                    color="red"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTask(task);
                                                    }}
                                                >
                                                    <IconTrash size={14} />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                        <Text size="sm" color="dimmed" lineClamp={2}>{task.description}</Text>
                                        <Group justify="space-between" mt="xs" gap="xs">
                                            <Button 
                                                size="xs" 
                                                variant="light"
                                                onClick={(e) => 
                                                    {
                                                        e.stopPropagation();handleUpdateTaskStatus(task.id, 'todo')}}
                                            >
                                                ← Back to Todo
                                            </Button>
                                            <Button 
                                                size="xs" 
                                                variant="light"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateTaskStatus(task.id, 'done');
                                                }}
                                            >
                                                Complete →
                                            </Button>
                                        </Group>
                                    </Card>
                                ))}
                            </Stack>
                        </Card>

                        {/* Done column */}
                        <Card withBorder padding="md">
                            <Text fw={700} mb="md">Done ({groupedTasks.done.length})</Text>
                            <Stack>
                                {groupedTasks.done.map((task: Task) => (
                                    <Card key={task.id} withBorder shadow="sm" padding="sm" onClick={()=>{
                                        form.setValues({
                                            id: task.id,
                                            title: task.title,
                                            description: task.description,
                                            status: task.status,
                                            priority: task.priority,
                                        });
                                        setIsEditing(true);
                                        open();
                                    }} style={{ cursor: 'pointer' }}>
                                        <Group flex="justify" mb="xs">
                                            <Text fw={500}>{task.title}</Text>
                                            <Group gap={5}>
                                                <Badge color={priorityColors[task.priority]}>
                                                    {task.priority}
                                                </Badge>
                                                <ActionIcon 
                                                    size="xs" 
                                                    color="red"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTask(task);
                                                    }}
                                                >
                                                    <IconTrash size={14} />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                        <Text size="sm" color="dimmed" lineClamp={2}>{task.description}</Text>
                                        <Group justify="flex-start" mt="xs">
                                            <Button 
                                                size="xs" 
                                                variant="light"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateTaskStatus(task.id, 'in_progress');
                                                }}
                                            >
                                                ← Resume Work
                                            </Button>
                                        </Group>
                                    </Card>
                                ))}
                            </Stack>
                        </Card>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="list">
                    <Stack>
                        {getFilteredTasks().length === 0 ? (
                            <Text ta="center" c="dimmed" py="xl">No tasks match your filter criteria</Text>
                        ) : (
                            getFilteredTasks().map((task: Task) => (
                                <Card key={task.id} withBorder padding="sm" onClick={()=>{
                                    form.setValues({
                                        id: task.id,
                                        title: task.title,
                                        description: task.description,
                                        status: task.status,
                                        priority: task.priority,
                                    });
                                    setIsEditing(true);
                                    open();
                                }}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500}>{task.title}</Text>
                                            <Text size="sm" c="dimmed" mt="xs">{task.description}</Text>
                                        </div>
                                        <Group>
                                            <Badge color={task.status === 'todo' ? 'blue' : task.status === 'in_progress' ? 'yellow' : 'green'}>
                                                {task.status === 'todo' ? 'To Do' : task.status === 'in_progress' ? 'In Progress' : 'Done'}
                                            </Badge>
                                            <Badge color={priorityColors[task.priority]}>{task.priority}</Badge>
                                            <ActionIcon color="red" onClick={() => handleDeleteTask(task)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Group>
                                </Card>
                            ))
                        )}
                    </Stack>
                </Tabs.Panel>
            </Tabs>

            {/* Add Task Modal */}
            <Modal opened={opened} onClose={close} title="Add New Task" centered>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Title"
                            placeholder="Task title"
                            required
                            {...form.getInputProps('title')}
                        />
                        <Textarea
                            label="Description"
                            placeholder="Task description"
                            required
                            minRows={3}
                            {...form.getInputProps('description')}
                        />
                        <Select
                            label="Status"
                            data={statusOptions}
                            defaultValue="todo"
                            {...form.getInputProps('status')}
                        />
                        <Select
                            label="Priority"
                            data={priorityOptions}
                            defaultValue="medium"
                            {...form.getInputProps('priority')}
                        />
                        {isEditing ? 
                        
                        <Button type="submit" fullWidth mt="md" loading={createTask.isPending}>
                            Update Task
                        </Button>
                        :<Button type="submit" fullWidth mt="md" loading={createTask.isPending}>
                            Create Task
                        </Button>}
                    </Stack>
                </form>
            </Modal>
        </div>
    );
};
import { useNavigate } from 'react-router-dom';
import { Button, Card,  Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';

export const HomePage = () => {
    const navigate = useNavigate();


    return (
        <div>

            <Card withBorder p="xl" radius="md">
                <Stack align="center" gap="md">
                    <Title order={3}>Welcome to Project Task Manager</Title>
                    <Text ta="center" c="dimmed" maw={600}>
                        A Nilacare take home project to manage your projects and tasks efficiently.
                    </Text>
                    <Button 
                        rightSection={<IconArrowRight size={16} />} 
                        onClick={() => navigate('/projects')}
                        mt="md"
                    >
                        Go to Projects
                    </Button>
                </Stack>
            </Card>
        </div>
    );
};

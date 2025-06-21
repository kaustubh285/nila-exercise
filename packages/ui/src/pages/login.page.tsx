import { useState } from 'react';
import { Button, Card, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { client } from '@nila/client/src/client.gen';
import { useNavigate } from 'react-router-dom';
import { successNotification, errorNotification } from '../utils/notifications';
import { useLogin, useRegister } from '../hooks/api-hooks';


interface UserFOrmValues {
    email: string;
    password: string;
}

interface LoginResponse {
    access_token?: string;
    Error?: UserFOrmValues;

}
export const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    

    const login = useLogin();
    const register = useRegister();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length >= 6 ? null : 'Password should be at least 6 characters'),
        },
    });

    const handleSubmit = async (values: UserFOrmValues) => {
        try {
            if (isRegistering) {

                await register.mutateAsync(values);
                successNotification('Account created! Please log in.');
                setIsRegistering(false);
            } else {

                const response = await login.mutateAsync(values) as LoginResponse;
                
                if (response.Error) {
                    errorNotification('Login failed. Check your credentials.');
                    return;
                }
                if (response.access_token) {
                localStorage.setItem('auth_token', response.access_token);
                client.setConfig({
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                    },
                });
                }
                
                successNotification('Login successful!');
                navigate('/projects');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            errorNotification(isRegistering ? 'Registration failed' : 'Login failed. Check your credentials.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Card withBorder shadow="md" p="xl" radius="md" w={400}>
                <Title order={2} ta="center" mt="md" mb={30}>
                    {isRegistering ? 'Create an account' : 'Welcome back'}
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Email"
                            placeholder="hello@example.com"
                            required
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            required
                            {...form.getInputProps('password')}
                        />

                        <Button 
                            fullWidth 
                            mt="xl" 
                            type="submit" 
                            loading={isRegistering ? register.isPending : login.isPending}
                        >
                            {isRegistering ? 'Register' : 'Login'}
                        </Button>
                    </Stack>
                </form>

                <Text ta="center" mt="md">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <Button 
                        variant="subtle" 
                        onClick={() => setIsRegistering(!isRegistering)}
                        disabled={login.isPending || register.isPending}
                    >
                        {isRegistering ? 'Login' : 'Register'}
                    </Button>
                </Text>
            </Card>
        </div>
    );
};
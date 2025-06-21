import {ActionIcon, AppShell, Group, Image} from '@mantine/core';
import {IconLogout} from '@tabler/icons-react';
import {Outlet, useNavigate} from 'react-router-dom';
import Logo from '../public/logo.png';
import {HeaderMenu} from './components/header.menu.tsx';
import { client } from '@nila/client/src/client.gen';
import { successNotification } from './utils/notifications';

export function App() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        
        client.setConfig({
            headers: {},
            baseUrl: import.meta.env.VITE_NILA_API_URL,
        });
        
        successNotification('Logged out successfully');
        navigate('/login');
    };

    return (
        <AppShell header={{height: 60}} padding="md">
            <AppShell.Header px={'xs'}>
                <Group justify={'space-between'} h={'100%'}>
                    <Image src={Logo} visibleFrom={'sm'} maw={100}/>
                    <Group gap={'xs'}>
                        <HeaderMenu/>
                        <ActionIcon 
                            size={'sm'} 
                            variant={'outline'}
                            color="red"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <IconLogout size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Main>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    );
}
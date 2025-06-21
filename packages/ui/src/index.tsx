import {JSX, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import {createTheme, MantineProvider} from '@mantine/core';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Notifications} from '@mantine/notifications';
import {App} from './App.tsx';
import {HomePage} from './pages/home.page.tsx';
import {ProjectsPage} from './pages/projects.page.tsx';
import {ProjectDetailPage} from './pages/project-detail.page.tsx';
import {LoginPage} from './pages/login.page.tsx';
import { client } from '@nila/client/src/client.gen.ts';


const token = localStorage.getItem('auth_token');
if (token) {
    client.setConfig({
        headers: {
            Authorization: `Bearer ${token}`,
        },
        baseUrl: import.meta.env.VITE_NILA_API_URL,
    });
} else {
    client.setConfig({
        baseUrl: import.meta.env.VITE_NILA_API_URL,
    });
}


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = localStorage.getItem('auth_token') !== null;
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const theme = createTheme({
    fontFamily: 'Geist, sans-serif',
    focusRing: 'never',
    colors: {
        main: ['#edf3ff', '#dae2f4', '#b3c2e6', '#8aa0d8', '#6783cc', '#5171c6', '#4568c4', '#3658ad', '#2e4e9c', '#21438a'],
        alt: ['#fff6eb', '#fcead5', '#fbd2a3', '#fbb96e', '#fba443', '#fb962a', '#fb901f', '#e07c14', '#c76e0d', '#ad5d00'],
    },
    primaryColor: 'main',
    primaryShade: 8,
    defaultRadius: 'md',
});

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60000 } },
});

const root = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <MantineProvider theme={theme}>
                    <BrowserRouter>
                        <Notifications position={'top-right'} transitionDuration={1000} />
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <App />
                                </ProtectedRoute>
                            }>
                                <Route index element={<HomePage />} />
                                <Route path="projects" element={<ProjectsPage />} />
                                <Route path="projects/:projectId" element={<ProjectDetailPage />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </MantineProvider>
            </QueryClientProvider>
        </StrictMode>,
    );
}
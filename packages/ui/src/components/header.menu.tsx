import {Tabs, Text} from '@mantine/core';
import {useLocation, useNavigate} from 'react-router-dom';

export const HeaderMenu = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<Tabs variant={'pills'} defaultValue={pathname === '/' ? 'home' : pathname.slice(1)} value={pathname === '/' ? 'home' : pathname.slice(1)}>
			<Tabs.List m={5}>
				<Tabs.Tab value="projects" onClick={() => navigate('/projects')} style={{ borderRadius: '10px' }}>
					<Text fz={14}>Projects</Text>
				</Tabs.Tab>
			</Tabs.List>
		</Tabs>
	);
};

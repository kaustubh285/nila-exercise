import {defineConfig} from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schemas',
	dialect: 'postgresql',
	migrations: {},
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	casing: 'snake_case',
});

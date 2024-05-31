import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},

	testMatch: ['**/__test__/**/*.test.ts'],
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;

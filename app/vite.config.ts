import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['dummy-lib']
	},
	build: {
		commonjsOptions: {
			include: ['dummy-lib', /node_modules/]
		}
	}
});

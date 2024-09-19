import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readdir } from 'node:fs/promises';

export const importRoutes = async (router) => {
    try {
        const routesDir = join(dirname(fileURLToPath(import.meta.url)), '../Routes');
        const files = await readdir(routesDir);
        const routeFiles = files.filter((file) => file.endsWith('.routes.js'));

        await Promise.all(routeFiles.map(async file => {
            const filePath = join(routesDir, file);
            const fileUrl = pathToFileURL(filePath).href;
            const { default: routes } = await import(fileUrl);
            const routeName = file.replace('.routes.js', '').toLowerCase();
            console.log(`✅ Route -> /api/v1/${routeName}`);
            router.use(`/api/v1/${routeName}`, routes);
        }));

    } catch (error) {
        console.error('Error importing routes:', error);
    }
};
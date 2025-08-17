import fg from 'fast-glob';
import child_process from 'child_process';

export default function vitePluginRoadroller() {
    return {
        name: 'roadroller',

        async closeBundle() {
            const files = await fg('dist/assets/**/*.js', { absolute: true });
            for (const file of files) {
                console.log(`Running roadroller...`);
                child_process.execSync(`yarn roadroller ${file} -o ${file}`, {stdio: 'inherit'});
            }
        },
    }
}
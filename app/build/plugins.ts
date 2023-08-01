import { PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

export function createPlugins(isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[])[] = [react()];
    return vitePlugins;
}

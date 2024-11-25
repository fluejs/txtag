import { defineConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

export default defineConfig({
    appearance: 'force-dark',
    title: '@fluejs/txtag',
    description: 'Dynamic text templating utility',
    markdown: {
        config(md) {
            md.use(tabsMarkdownPlugin);
        },
    },
    themeConfig: {
        nav: [{
            text: 'Home',
            link: '/',
        },
        {
            text: 'Guide',
            link: '/guide',
        }],
        socialLinks: [{
            icon: 'github',
            link: 'https://github.com/fluejs/txtag',
        }],
    },
});
